import { Router } from 'express';
import { z } from 'zod';
import { importChannelMembership } from '../services/campaignService';

export const channelRouter = Router();

const importSchema = z.object({
  campaign_key: z.string().default('ig_channel_invite'),
  platform_contact_id: z.array(z.string().min(1)).min(1)
});

channelRouter.post('/import', async (req, res, next) => {
  try {
    const payload = importSchema.parse(req.body);
    const result = await importChannelMembership(payload.platform_contact_id, payload.campaign_key);
    res.json(result);
  } catch (error) {
    next(error);
  }
});
