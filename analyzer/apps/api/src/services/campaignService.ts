import { env } from '../config/env';
import { supabase } from '../db/supabase';
import { ContactState } from '../types/domain';

const SKIP_STATES: ContactState[] = ['joined', 'skipped', 'do_not_contact'];

interface ContactStateRow {
  id: string;
  contact_id: string;
  campaign_key: string;
  state: ContactState;
  last_action_at: string | null;
}

const isRecentlyInvited = (row: ContactStateRow): boolean => {
  if (row.state !== 'invited' || !row.last_action_at) return false;
  const lastAction = new Date(row.last_action_at).getTime();
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return lastAction >= sevenDaysAgo;
};

export const runInviteCampaign = async (campaignKey = 'ig_channel_invite') => {
  const { data, error } = await supabase
    .from('contact_states')
    .select('id, contact_id, campaign_key, state, last_action_at')
    .eq('campaign_key', campaignKey);

  if (error) throw error;

  const rows = (data ?? []) as ContactStateRow[];

  const eligible = rows.filter((row) => !SKIP_STATES.includes(row.state) && !isRecentlyInvited(row));
  const skipped = rows.length - eligible.length;
  const now = new Date().toISOString();

  for (const row of eligible) {
    const { error: updateError } = await supabase
      .from('contact_states')
      .update({ state: 'invited', last_action_at: now })
      .eq('id', row.id);

    if (updateError) throw updateError;

    const { error: queueError } = await supabase.from('invite_queue').insert({
      campaign_key: campaignKey,
      contact_id: row.contact_id,
      message_body: env.INVITE_MESSAGE_TEMPLATE,
      status: 'queued',
      metadata: {
        reason: 'campaign_invite'
      }
    });

    if (queueError) throw queueError;
  }

  return {
    total: rows.length,
    eligible: eligible.length,
    skipped,
    queued: eligible.length
  };
};

export const importChannelMembership = async (platformContactIds: string[], campaignKey = 'ig_channel_invite') => {
  if (platformContactIds.length === 0) {
    return { updated: 0 };
  }

  const { data: contacts, error: contactError } = await supabase
    .from('contacts')
    .select('id, platform_contact_id')
    .in('platform_contact_id', platformContactIds);

  if (contactError) throw contactError;

  const contactIds = (contacts ?? []).map((contact) => contact.id);
  if (contactIds.length === 0) return { updated: 0 };

  const { error: updateError } = await supabase
    .from('contact_states')
    .upsert(
      contactIds.map((contactId) => ({
        contact_id: contactId,
        campaign_key: campaignKey,
        state: 'joined' as const,
        last_action_at: new Date().toISOString()
      })),
      { onConflict: 'contact_id,campaign_key' }
    );

  if (updateError) throw updateError;

  return { updated: contactIds.length };
};
