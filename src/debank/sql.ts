import { createClient } from '@libsql/client';
import 'dotenv/config';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL as string,
  authToken: process.env.TURSO_AUTH_TOKEN as string,
});

export async function getDebankData() {
  const res = await turso.execute('SELECT * FROM account');
  console.log(res.rows);
  return res.rows;
}

export async function insertData({
  address,
  value,
  time,
}: {
  address: string;
  value: number;
  time: number;
}) {
  await turso.execute({
    sql: 'INSERT INTO account (address, total_assets, time) VALUES (?, ?, ?)',
    args: [address, value, time],
  });
}
