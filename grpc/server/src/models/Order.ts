import { Schema, Document, model } from 'mongoose';

export interface OrderDocument extends Document {
  orderId: string;
  customerEmail: string;
  amount: number;
  status: 'created' | 'fulfilled' | 'canceled';
  notes?: string;
  createdAt: Date;
}

const orderSchema = new Schema<OrderDocument>({
  orderId: { type: String, required: true, unique: true },
  customerEmail: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['created', 'fulfilled', 'canceled'], default: 'created' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const OrderModel = model<OrderDocument>('Order', orderSchema);
