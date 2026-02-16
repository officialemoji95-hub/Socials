import { Router } from 'express';
import { pollInstagram, pollTikTok } from '../services/pollingService';

export const pollRouter = Router();

const runInstagram = async (_req: any, res: any, next: any) => {
  try {
    const result = await pollInstagram();
    res.json({ platform: 'instagram', ...result });
  } catch (error) {
    next(error);
  }
};

const runTikTok = async (_req: any, res: any, next: any) => {
  try {
    const result = await pollTikTok();
    res.json({ platform: 'tiktok', ...result });
  } catch (error) {
    next(error);
  }
};

// Support both GET (browser) and POST (programmatic)
pollRouter.get('/instagram', runInstagram);
pollRouter.post('/instagram', runInstagram);

pollRouter.get('/tiktok', runTikTok);
pollRouter.post('/tiktok', runTikTok);
