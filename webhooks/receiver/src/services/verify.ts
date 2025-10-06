import crypto from 'crypto';
import { z } from 'zod';

const payloadSchema = z.object({
  type: z.string(),
});

export const verifySignature = (
  provider: string,
  payload: unknown,
  signature: string,
  timestamp: string,
) => {
  if (!process.env.WEBHOOK_SECRET) {
    throw new Error('WEBHOOK_SECRET is not configured');
  }

  const timestampMs = Number(timestamp);
  if (Number.isNaN(timestampMs) || Date.now() - timestampMs > 5 * 60 * 1000) {
    throw new Error('Request expired');
  }

  const serialized = JSON.stringify(payload);
  const expected = crypto
    .createHmac('sha256', `${process.env.WEBHOOK_SECRET}:${provider}`)
    .update(timestamp + serialized)
    .digest('hex');

  const providedBuffer = Buffer.from(signature, 'hex');
  const expectedBuffer = Buffer.from(expected, 'hex');

  if (providedBuffer.length !== expectedBuffer.length) {
    throw new Error('Invalid signature length');
  }

  if (!crypto.timingSafeEqual(providedBuffer, expectedBuffer)) {
    throw new Error('Invalid signature');
  }

  payloadSchema.parse(payload);
};
