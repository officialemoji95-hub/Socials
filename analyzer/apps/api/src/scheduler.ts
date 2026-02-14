import cron from 'node-cron';
import { pollInstagram, pollTikTok } from './services/pollingService';

export const startScheduler = () => {
  cron.schedule('*/3 * * * *', async () => {
    try {
      const [instagramResult, tiktokResult] = await Promise.all([pollInstagram(), pollTikTok()]);
      console.log('[scheduler] poll completed', { instagramResult, tiktokResult });
    } catch (error) {
      console.error('[scheduler] poll failed', error);
    }
  });
};
