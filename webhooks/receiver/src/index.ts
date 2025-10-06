import { connectMongo, logger } from '@realtime-labs/shared';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import pinoHttp from 'pino-http';

import { webhooksRouter } from './routes/webhooks';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(pinoHttp({ logger: logger as any }));
app.use(express.json({ limit: '1mb' }));
app.use('/webhooks', webhooksRouter);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

const start = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      throw new Error('MONGO_URL is not defined');
    }
    await connectMongo(mongoUrl);

    app.listen(port, () => {
      logger.info(`Webhooks receiver listening on port ${port}`);
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to start receiver');
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  void start();
}

export { app };
