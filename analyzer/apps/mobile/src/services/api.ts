import Constants from 'expo-constants';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? Constants.expoConfig?.extra?.apiBaseUrl;

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
  getAccounts: () => request<any[]>('/accounts'),
  runInviteCampaign: () => request<{ total: number; eligible: number; queued: number; skipped: number }>('/campaigns/invite', { method: 'POST', body: JSON.stringify({}) })
};
