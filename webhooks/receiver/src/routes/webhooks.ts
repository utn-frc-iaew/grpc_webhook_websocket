import { logger } from '@realtime-labs/shared';
import { Router, Request, Response } from 'express';

import { WebhookEventModel } from '../models/WebhookEvent';
import { handleOrderCanceled } from '../services/handlers/order.canceled';
import { handleOrderCreated } from '../services/handlers/order.created';
import { enqueueRetry } from '../services/retry';
import { verifySignature } from '../services/verify';

export const webhooksRouter = Router();

webhooksRouter.post('/:provider', async (req: Request, res: Response) => {
  const provider = req.params.provider;
  const signature = req.header('X-Signature') || '';
  const timestamp = req.header('X-Timestamp');
  const payload = req.body;

  if (!timestamp) {
    return res.status(400).json({ error: 'X-Timestamp header required' });
  }

  try {
    verifySignature(provider, payload, signature, timestamp);
  } catch (error) {
    return res.status(401).json({ error: (error as Error).message });
  }

  try {
    const event = await WebhookEventModel.create({
      provider,
      type: payload.type,
      payload,
      receivedAt: new Date(),
    });

    switch (payload.type) {
      case 'order.created':
        await handleOrderCreated(event);
        break;
      case 'order.canceled':
        await handleOrderCanceled(event);
        break;
      default:
        logger.info({ type: payload.type }, 'Unhandled webhook event type');
        break;
    }

    res.status(202).json({ status: 'accepted' });
  } catch (error) {
    await enqueueRetry({ provider, payload, attempts: 1 });
    res.status(500).json({ error: 'Failed to process event', details: (error as Error).message });
  }
});
