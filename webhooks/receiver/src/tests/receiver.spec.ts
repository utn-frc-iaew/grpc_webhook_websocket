import request from 'supertest';

import { app } from '../index';

describe('Webhooks Receiver', () => {
  it('returns 400 when timestamp missing', async () => {
    const response = await request(app)
      .post('/webhooks/demo')
      .set('X-Signature', 'test')
      .send({ type: 'order.created' });

    expect(response.status).toBe(400);
  });
});
