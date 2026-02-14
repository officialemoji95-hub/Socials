import { supabase } from '../db/supabase';
import { Account, Platform } from '../types/domain';
import { fetchInstagramLatestMedia, fetchTikTokLatestVideo } from './socialClients';

const getAccountsByPlatform = async (platform: Platform): Promise<Account[]> => {
  const { data, error } = await supabase.from('accounts').select('*').eq('platform', platform);
  if (error) throw error;
  return (data ?? []) as Account[];
};

const hasPost = async (platform: Platform, externalPostId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('posts')
    .select('id')
    .eq('platform', platform)
    .eq('external_post_id', externalPostId)
    .maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  return Boolean(data?.id);
};

const insertPost = async (accountId: string, platform: Platform, externalPostId: string, payload: unknown, postedAt?: string): Promise<void> => {
  const { error } = await supabase.from('posts').insert({
    account_id: accountId,
    platform,
    external_post_id: externalPostId,
    posted_at: postedAt ?? null,
    payload
  });

  if (error) throw error;
};

export const pollInstagram = async (): Promise<{ checked: number; inserted: number }> => {
  const accounts = await getAccountsByPlatform('instagram');
  let inserted = 0;

  for (const account of accounts) {
    if (!account.access_token) continue;

    const media = await fetchInstagramLatestMedia(account.access_token);
    if (!media?.id) continue;

    const exists = await hasPost('instagram', media.id);
    if (exists) continue;

    await insertPost(account.id, 'instagram', media.id, media, media.timestamp);
    inserted += 1;
  }

  return { checked: accounts.length, inserted };
};

export const pollTikTok = async (): Promise<{ checked: number; inserted: number }> => {
  const accounts = await getAccountsByPlatform('tiktok');
  let inserted = 0;

  for (const account of accounts) {
    if (!account.access_token) continue;

    const video = await fetchTikTokLatestVideo(account.access_token);
    if (!video?.id) continue;

    const exists = await hasPost('tiktok', video.id);
    if (exists) continue;

    const postedAt = video.create_time ? new Date(video.create_time * 1000).toISOString() : undefined;
    await insertPost(account.id, 'tiktok', video.id, video, postedAt);
    inserted += 1;
  }

  return { checked: accounts.length, inserted };
};
