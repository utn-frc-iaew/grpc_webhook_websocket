import { OrderModel } from '../models/Order';

describe('OrderModel', () => {
  it('has required fields', () => {
    const orderIdPath = OrderModel.schema.path('orderId');
    expect(orderIdPath).toBeDefined();
    expect(orderIdPath.options.required).toBeTruthy();
  });
});
