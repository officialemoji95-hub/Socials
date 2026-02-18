import Constants from 'expo-constants';
import { Contact, ContactState } from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? Constants.expoConfig?.extra?.apiBaseUrl;

type Platform = 'instagram' | 'tiktok';

interface CreateAccountPayload {
  user_id: string;
  platform: Platform;
  platform_account_id: string;
  username?: string;
  access_token?: string;
}

export interface AccountRecord {
  id: string;
  user_id: string;
  platform: Platform;
  platform_account_id: string;
  username: string | null;
  access_token: string | null;
  refresh_token: string | null;
  token_expires_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface ApiContact {
  id: string;
  display_name: string | null;
  platform_contact_id: string;
  state: ContactState;
}

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'API request failed');
  }

  return response.json() as Promise<T>;
};

export const api = {
  getAccounts: () => request<AccountRecord[]>('/accounts'),
  createAccount: (payload: CreateAccountPayload) => request<AccountRecord>('/accounts', { method: 'POST', body: JSON.stringify(payload) }),
  getContacts: async (): Promise<Contact[]> => {
    const contacts = await request<ApiContact[]>('/contacts');
    return contacts.map((contact) => ({
      id: contact.id,
      display_name: contact.display_name ?? 'Unknown contact',
      platform_contact_id: contact.platform_contact_id,
      state: contact.state
    }));
  },
  runInviteCampaign: () => request<{ total: number; eligible: number; queued: number; skipped: number }>('/campaigns/invite', { method: 'POST', body: JSON.stringify({}) })
};
