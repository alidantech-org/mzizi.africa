import { Client } from "pg";

/**
 * Test helper: creates (or recreates) a scratch database on the server named by TEST_DATABASE_URL
 * and returns its connection URL, so integration suites that run in parallel never share a schema.
 */
export async function scratchDatabase(adminUrl: string, name: string): Promise<string> {
  const admin = new URL(adminUrl);
  const client = new Client({ connectionString: adminUrl });
  await client.connect();
  try {
    await client.query(`DROP DATABASE IF EXISTS ${name} WITH (FORCE)`);
    await client.query(`CREATE DATABASE ${name}`);
  } finally {
    await client.end();
  }
  admin.pathname = `/${name}`;
  return admin.toString();
}
