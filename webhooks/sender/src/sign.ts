import crypto from 'crypto';

export const signPayload = (provider: string, payload: Record<string, unknown>, secret: string) => {
  const timestamp = Date.now().toString();
  const serialized = JSON.stringify(payload);
  const signature = crypto
    .createHmac('sha256', `${secret}:${provider}`)
    .update(timestamp + serialized)
    .digest('hex');

  return { signature, timestamp };
};
