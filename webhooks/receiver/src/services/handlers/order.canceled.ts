import { emitOrderNotification, logger } from '@realtime-labs/shared';

import { WebhookEventDocument } from '../../models/WebhookEvent';

type OrderCanceledPayload = {
  data?: {
    id?: string;
    status?: string;
    reason?: string;
  };
};

export const handleOrderCanceled = async (event: WebhookEventDocument) => {
  logger.info({ eventId: event.id, type: event.type }, 'Handling order.canceled event');

  const payload = event.payload as OrderCanceledPayload;
  const orderId = payload?.data?.id;
  const status = payload?.data?.status ?? 'canceled';
  const reason = payload?.data?.reason;

  if (!orderId) {
    logger.warn({ eventId: event.id }, 'order.canceled event missing data.id');
    return;
  }

  const statusWithReason = reason ? `${status} (${reason})` : status;

  await emitOrderNotification({
    orderId,
    status: statusWithReason,
  });
};
