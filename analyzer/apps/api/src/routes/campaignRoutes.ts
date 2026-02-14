import { Router } from 'express';
import { z } from 'zod';
import { runInviteCampaign } from '../services/campaignService';

export const campaignRouter = Router();

const inviteSchema = z.object({
  campaign_key: z.string().default('ig_channel_invite')
});

campaignRouter.post('/invite', async (req, res, next) => {
  try {
    const payload = inviteSchema.parse(req.body ?? {});
    const result = await runInviteCampaign(payload.campaign_key);
    res.json(result);
  } catch (error) {
    next(error);
  }
});
