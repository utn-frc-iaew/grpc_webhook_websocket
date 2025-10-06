import { logger } from '@realtime-labs/shared';

import { WebhookEventDocument } from '../../models/WebhookEvent';
import { emitOrderNotification } from '../notifications';

type OrderCreatedPayload = {
  data?: {
    id?: string;
    status?: string;
    customerEmail?: string;
  };
};

export const handleOrderCreated = async (event: WebhookEventDocument) => {
  logger.info({ eventId: event.id, type: event.type }, 'Handling order.created event');

  const payload = event.payload as OrderCreatedPayload;
  const orderId = payload?.data?.id;
  const status = payload?.data?.status ?? 'created';

  if (!orderId) {
    logger.warn({ eventId: event.id }, 'order.created event missing data.id');
    return;
  }

  await emitOrderNotification({
    orderId,
    status,
  });
};
