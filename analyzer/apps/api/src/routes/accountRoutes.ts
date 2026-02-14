import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../db/supabase';
import { AppError } from '../middleware/errorHandler';

export const accountRouter = Router();

const platformSchema = z.enum(['instagram', 'tiktok']);

const createAccountSchema = z.object({
  user_id: z.string().uuid(),
  platform: platformSchema,
  platform_account_id: z.string().min(1),
  username: z.string().optional(),
  access_token: z.string().optional(),
  refresh_token: z.string().optional(),
  token_expires_at: z.string().datetime().optional(),
  metadata: z.record(z.unknown()).optional()
});

const updateAccountSchema = createAccountSchema.partial();

accountRouter.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await supabase.from('accounts').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data ?? []);
  } catch (error) {
    next(error);
  }
});

accountRouter.post('/', async (req, res, next) => {
  try {
    const payload = createAccountSchema.parse(req.body);
    const { data, error } = await supabase.from('accounts').insert(payload).select('*').single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

accountRouter.patch('/:id', async (req, res, next) => {
  try {
    const id = z.string().uuid().parse(req.params.id);
    const payload = updateAccountSchema.parse(req.body);
    if (Object.keys(payload).length === 0) {
      throw new AppError('No fields provided for update', 400);
    }

    const { data, error } = await supabase.from('accounts').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
});

accountRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = z.string().uuid().parse(req.params.id);
    const { error } = await supabase.from('accounts').delete().eq('id', id);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
