import { Router } from 'express';
import { pollInstagram, pollTikTok } from '../services/pollingService';

export const pollRouter = Router();

pollRouter.post('/instagram', async (_req, res, next) => {
  try {
    const result = await pollInstagram();
    res.json({ platform: 'instagram', ...result });
  } catch (error) {
    next(error);
  }
});

pollRouter.post('/tiktok', async (_req, res, next) => {
  try {
    const result = await pollTikTok();
    res.json({ platform: 'tiktok', ...result });
  } catch (error) {
    next(error);
  }
});
