import cors from 'cors';
import express from 'express';
import { accountRouter } from './routes/accountRoutes';
import { campaignRouter } from './routes/campaignRoutes';
import { channelRouter } from './routes/channelRoutes';
import { healthRouter } from './routes/healthRoutes';
import { pollRouter } from './routes/pollRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/health', healthRouter);
  app.use('/accounts', accountRouter);
  app.use('/poll', pollRouter);
  app.use('/campaigns', campaignRouter);
  app.use('/channels', channelRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
