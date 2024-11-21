import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read and parse the point.json file
const pointData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'point.json'), 'utf8')
);

// Calculate total points across all rows
const totalPoints = pointData.rows.reduce((sum, row) => {
  return sum + parseFloat(row.totalPoints);
}, 0);

const myPoints = 113187;

const percentage = myPoints / totalPoints;
console.log(`占比: ${percentage.toFixed(8)}`);

const tvl = 1000000000;

console.log(`Total points across all users: ${totalPoints.toLocaleString()}`);
