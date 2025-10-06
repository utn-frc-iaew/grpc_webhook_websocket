import { logger } from '@realtime-labs/shared';

const MAX_ATTEMPTS = 3;

interface RetryPayload {
  provider: string;
  payload: Record<string, unknown>;
  attempts: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const enqueueRetry = async ({ provider, payload, attempts }: RetryPayload) => {
  if (attempts > MAX_ATTEMPTS) {
    logger.error({ provider }, 'Max retry attempts reached');
    return;
  }

  const backoff = 2 ** (attempts - 1) * 1000;
  await sleep(backoff);

  const url = process.env.RETRY_TARGET_URL;
  if (!url) {
    logger.warn('RETRY_TARGET_URL not configured');
    return;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ provider, payload, attempts }),
    });

    if (!response.ok) {
      throw new Error(`Retry request failed with status ${response.status}`);
    }
  } catch (error) {
    logger.error({ err: error, provider, attempts }, 'Retry attempt failed');
    await enqueueRetry({ provider, payload, attempts: attempts + 1 });
  }
};
