import { env } from '../config/env';

interface InstagramMedia {
  id: string;
  timestamp?: string;
}

interface TiktokVideo {
  id: string;
  create_time?: number;
}

export const fetchInstagramLatestMedia = async (accessToken: string): Promise<InstagramMedia | null> => {
  const url = new URL('/me/media', env.INSTAGRAM_GRAPH_BASE_URL);
  url.searchParams.set('fields', 'id,timestamp');
  url.searchParams.set('limit', '1');
  url.searchParams.set('access_token', accessToken);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Instagram API error: ${response.status}`);
  }

  const payload = (await response.json()) as { data?: InstagramMedia[] };
  return payload.data?.[0] ?? null;
};

export const fetchTikTokLatestVideo = async (accessToken: string): Promise<TiktokVideo | null> => {
  const url = new URL('/v2/video/list/', env.TIKTOK_API_BASE_URL);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      max_count: 1
    })
  });

  if (!response.ok) {
    throw new Error(`TikTok API error: ${response.status}`);
  }

  const payload = (await response.json()) as {
    data?: {
      videos?: TiktokVideo[];
    };
  };

  return payload.data?.videos?.[0] ?? null;
};
