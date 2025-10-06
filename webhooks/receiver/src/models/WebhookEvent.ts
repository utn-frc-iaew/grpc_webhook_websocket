import { Schema, model, Document } from 'mongoose';

export interface WebhookEventDocument extends Document {
  provider: string;
  type: string;
  payload: Record<string, unknown>;
  receivedAt: Date;
  retries: number;
}

const schema = new Schema<WebhookEventDocument>({
  provider: { type: String, required: true },
  type: { type: String, required: true },
  payload: { type: Schema.Types.Mixed, required: true },
  receivedAt: { type: Date, default: Date.now },
  retries: { type: Number, default: 0 },
});

export const WebhookEventModel = model<WebhookEventDocument>('WebhookEvent', schema);
