#!/usr/bin/env zx
import { schedule } from 'node-cron';

import { $, chalk } from 'zx';
import puppeteer from 'puppeteer';
import { insertData } from './sql';

const address = process.env.ADDRESS;

async function fetchDebankProfileAndSaveData() {
  try {
    console.log(chalk.blue('Opening DeBank profile and printing to PDF...'));

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://debank.com/profile/${address}`, {
      waitUntil: 'networkidle0',
    });

    // Set the viewport to a desktop size
    await page.setViewport({ width: 1920, height: 1080 });
    // Wait for the element with class containing 'HeaderInfo_totalAsset' to load
    await page.waitForSelector('[class*="HeaderInfo_totalAsset"]');

    // Extract the text content of the element
    const totalAssetText = await page.evaluate(() => {
      const element = document.querySelector(
        '[class*="HeaderInfo_totalAsset"]'
      );
      return element
        ? element.firstChild?.textContent?.trim()
        : 'Element not found';
    });

    // Split totalAssetText by '+' or '-'
    const assetParts = (totalAssetText || '').split(/[+-]/);
    const totalAsset =
      parseFloat((assetParts[0] || '0').replace(/[$,]/g, '')) || 0;

    // Print the extracted text
    console.log(chalk.cyan('Total Asset:'), totalAsset);

    await insertData({
      address: address || '',
      value: totalAsset,
      time: Date.now(),
    });

    await browser.close();
  } catch (error) {
    console.error(
      chalk.red('An error occurred while processing DeBank profile:'),
      error
    );
  }
}

// Schedule the task to run every hour
schedule('0 * * * *', () => {
  const currentTime = new Date().toLocaleString();
  console.log(
    chalk.yellow(`Running scheduled DeBank profile check at ${currentTime}...`)
  );
  fetchDebankProfileAndSaveData();
});

// Initial run
fetchDebankProfileAndSaveData();

console.log(chalk.blue('DeBank profile check scheduled to run every hour.'));
