import * as fs from 'fs';
import * as cheerio from 'cheerio';
import * as path from 'path';
import { createObjectCsvWriter } from 'csv-writer';

function parseTableData(): { amount: number; ratio: number }[] {
  const html = fs.readFileSync('src/suite/d.html', 'utf-8');
  const $ = cheerio.load(html);

  const data: { amount: number; ratio: number }[] = [];

  $('table.table tbody tr').each((_, row) => {
    const columns = $(row).find('td');
    if (columns.length >= 4) {
      const amount =
        parseFloat($(columns[2]).text().trim().replace(/,/g, '')) || 0;
      const ratioText = $(columns[3]).text().trim();
      const ratio = parseFloat(ratioText) / 100 || 0;

      data.push({ amount, ratio });
    }
  });

  return data;
}

const tableData = parseTableData();
console.log(tableData);

// Group and sum the data based on ratio ranges
const groupedData = tableData.reduce(
  (acc, { amount, ratio }) => {
    if (ratio > 0.02) {
      acc.high.amount += amount;
      acc.high.ratio += ratio;
    } else if (ratio >= 0.01 && ratio <= 0.0199) {
      acc.medium.amount += amount;
      acc.medium.ratio += ratio;
    } else if (ratio >= 0.001 && ratio < 0.01) {
      acc.low.amount += amount;
      acc.low.ratio += ratio;
    }
    return acc;
  },
  {
    high: { amount: 0, ratio: 0 },
    medium: { amount: 0, ratio: 0 },
    low: { amount: 0, ratio: 0 },
  }
);

console.log('Grouped data:');
console.log('High (ratio > 0.02):', groupedData.high);
console.log('Medium (0.01 <= ratio <= 0.0199):', groupedData.medium);
console.log('Low (0.001 <= ratio < 0.01):', groupedData.low);

console.log([groupedData.high, groupedData.medium, groupedData.low]);

// Save the data to a JSON file
const jsonFilePath = path.join(__dirname, 'tableData.json');
fs.writeFileSync(jsonFilePath, JSON.stringify(tableData, null, 2));
console.log('The JSON file was written successfully');

// Output the data
console.log('Table Data:');
tableData.forEach((item, index) => {
  console.log(`Row ${index + 1}: Amount: ${item.amount}, Ratio: ${item.ratio}`);
});

// Calculate and output some statistics
const totalAmount = tableData.reduce((sum, item) => sum + item.amount, 0);
const totalRatio = tableData.reduce((sum, item) => sum + item.ratio, 0);
const averageAmount = totalAmount / tableData.length;
const averageRatio = totalRatio / tableData.length;

console.log('\nStatistics:');
console.log(`Total Amount: ${totalAmount}`);
console.log(`Total Ratio: ${totalRatio}`);
console.log(`Average Amount: ${averageAmount}`);
console.log(`Average Ratio: ${averageRatio}`);
const csvFilePath = path.join(__dirname, 'tableData.csv');

// Create a CSV writer
const csvWriter = createObjectCsvWriter({
  path: csvFilePath,
  header: [
    { id: 'amount', title: 'Amount' },
    { id: 'ratio', title: 'Ratio' },
  ],
});

// Write the data to the CSV file
csvWriter
  .writeRecords(tableData)
  .then(() => {
    console.log('The CSV file was written successfully');
  })
  .catch(error => {
    console.error('Error writing CSV file:', error);
  });
