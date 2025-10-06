import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { z } from 'zod';

import { seedOrders } from './scenarios/seedOrders';
import { signPayload } from './sign';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3002;

const envSchema = z.object({
  RECEIVER_URL: z.string().url(),
  WEBHOOK_SECRET: z.string().min(10, 'WEBHOOK_SECRET must be at least 10 characters'),
});

app.get('/send', async (_req: Request, res: Response) => {
  try {
    const { RECEIVER_URL: url, WEBHOOK_SECRET: secret } = envSchema.parse(process.env);

    const orders = seedOrders();

    for (const order of orders) {
      const { signature, timestamp } = signPayload('demo', order, secret);

      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': signature,
          'X-Timestamp': timestamp,
        },
        body: JSON.stringify(order),
      });
    }

    res.json({ status: 'sent', count: orders.length });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(port, () => {
  console.log(`Webhook sender listening on port ${port}`);
});
