export type ContactState = 'opted_in' | 'invited' | 'joined' | 'skipped' | 'do_not_contact';

export interface ConnectedAccount {
  id: string;
  platform: 'instagram' | 'tiktok';
  username: string;
  lastDetectedPost?: string;
}

export interface CampaignCounts {
  opted_in: number;
  invited: number;
  joined: number;
  skipped: number;
}

export interface Contact {
  id: string;
  display_name: string;
  platform_contact_id: string;
  state: ContactState;
}
