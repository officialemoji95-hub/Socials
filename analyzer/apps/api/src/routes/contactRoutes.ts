import { Router } from 'express';
import { supabase } from '../db/supabase';

interface ContactRow {
  id: string;
  display_name: string | null;
  platform_contact_id: string;
}

interface ContactStateRow {
  contact_id: string;
  state: 'opted_in' | 'invited' | 'joined' | 'skipped' | 'do_not_contact';
}

export const contactRouter = Router();

contactRouter.get('/', async (_req, res, next) => {
  try {
    const { data: contactsData, error: contactsError } = await supabase
      .from('contacts')
      .select('id, display_name, platform_contact_id')
      .order('created_at', { ascending: false });

    if (contactsError) throw contactsError;

    const contacts = (contactsData ?? []) as ContactRow[];

    const { data: statesData, error: statesError } = await supabase
      .from('contact_states')
      .select('contact_id, state')
      .eq('campaign_key', 'ig_channel_invite');

    if (statesError) throw statesError;

    const stateMap = new Map((statesData ?? []).map((row) => [row.contact_id, row.state])) as Map<string, ContactStateRow['state']>;

    res.json(
      contacts.map((contact) => ({
        ...contact,
        state: stateMap.get(contact.id) ?? 'opted_in'
      }))
    );
  } catch (error) {
    next(error);
  }
});
