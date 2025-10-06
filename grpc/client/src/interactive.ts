import inquirer from 'inquirer';

import { createOrder } from './index';

const main = async () => {
  const { action } = await inquirer.prompt<{ action: string }>([
    {
      type: 'list',
      name: 'action',
      message: 'Choose gRPC action',
      choices: [
        { name: 'Create order (Unary)', value: 'create' },
        { name: 'Exit', value: 'exit' },
      ],
    },
  ]);

  if (action === 'create') {
    const order = await createOrder();
    console.log('Created order:', order);
    await main();
  }
};

void main();
