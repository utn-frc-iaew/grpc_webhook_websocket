import { MessageModel } from '../models/Message';

describe('MessageModel', () => {
  it('requires author and text', () => {
    const authorPath = MessageModel.schema.path('author');
    const textPath = MessageModel.schema.path('text');

    expect(authorPath).toBeDefined();
    expect(textPath).toBeDefined();
    expect(authorPath.options.required).toBeTruthy();
    expect(textPath.options.required).toBeTruthy();
  });
});
