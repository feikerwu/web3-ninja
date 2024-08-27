#!/usr/bin/env zx

import { $, chalk } from 'zx';

async function getRank(address: string) {
  try {
    console.log(chalk.blue('Starting Linea rank retrieval...'));

    // Fetch the Linea rank data
    const { stdout } =
      await $`curl https://kx58j6x5me.execute-api.us-east-1.amazonaws.com/linea/getUserPointsSearch?user=${address}`;

    const rankData = JSON.parse(stdout);

    console.log(rankData);

    for (const item of rankData) {
      console.log(chalk.green(`address: ${item.user_address}`));
      console.log(chalk.green(`rank: ${item.rank_xp}`));
      console.log(chalk.green(`points: ${item.ep}`));
    }
    // You can add more processing or data display here as needed
  } catch (error) {
    console.error(chalk.red('An error occurred:'), error);
  }
}

getRank('0x0c6590dcda9d5fdcb9cffd453c9952f0515a8ef6');
