import { createApp } from './app';
import { env } from './config/env';
import { startScheduler } from './scheduler';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`API listening on port ${env.PORT}`);
});

startScheduler();
