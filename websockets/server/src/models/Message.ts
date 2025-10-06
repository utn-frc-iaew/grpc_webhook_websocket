import { Schema, model, Document } from 'mongoose';

export interface MessageDocument extends Document {
  author: string;
  text: string;
  channel: string;
  createdAt: Date;
}

const messageSchema = new Schema<MessageDocument>({
  author: { type: String, required: true },
  text: { type: String, required: true },
  channel: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const MessageModel = model<MessageDocument>('Message', messageSchema);
