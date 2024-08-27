#!/usr/bin/env zx

import { schedule } from 'node-cron';
import { $, chalk } from 'zx';

async function getRank(address: string) {
  try {
    console.log(chalk.blue('Starting Linea rank retrieval...'));

    // Fetch the Linea rank data
    const { stdout } =
      await $`curl -s https://kx58j6x5me.execute-api.us-east-1.amazonaws.com/linea/getUserPointsSearch?user=${address}`;

    const rankData = JSON.parse(stdout);

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

// Function to get and log the rank
async function getAndLogRank() {
  await getRank('0x0c6590dcda9d5fdcb9cffd453c9952f0515a8ef6');
}

// Schedule the task to run every minute
schedule('* * * * *', () => {
  const currentTime = new Date().toLocaleString();
  console.log(
    chalk.yellow(`Running scheduled rank check at ${currentTime}...`)
  );
  getAndLogRank();
});

// Initial run
getAndLogRank();

console.log(chalk.blue('Rank retrieval scheduled to run every minute.'));
