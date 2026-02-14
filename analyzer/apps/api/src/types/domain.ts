export type Platform = 'instagram' | 'tiktok';
export type ContactState = 'opted_in' | 'invited' | 'joined' | 'skipped' | 'do_not_contact';

export interface Account {
  id: string;
  user_id: string;
  platform: Platform;
  platform_account_id: string;
  username: string | null;
  access_token: string | null;
  refresh_token: string | null;
  token_expires_at: string | null;
  metadata: Record<string, unknown>;
}
