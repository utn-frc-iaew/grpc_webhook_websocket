export interface OrderPayload {
    id: string;
    status: 'created' | 'canceled' | 'fulfilled';
    amount: number;
    currency: string;
    customerEmail: string;
    createdAt: string;
}
export interface WebhookEvent {
    provider: string;
    type: string;
    payload: Record<string, unknown>;
    receivedAt: Date;
    retries?: number;
}
//# sourceMappingURL=index.d.ts.map