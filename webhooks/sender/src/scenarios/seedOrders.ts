export const seedOrders = () => [
  {
    type: 'order.created',
    data: {
      id: 'order-1',
      status: 'created',
      amount: 3499,
      currency: 'USD',
      customerEmail: 'customer@example.com',
      createdAt: new Date().toISOString(),
    },
  },
  {
    type: 'order.canceled',
    data: {
      id: 'order-2',
      status: 'canceled',
      reason: 'payment_failed',
      createdAt: new Date().toISOString(),
    },
  },
];
