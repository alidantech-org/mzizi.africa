import { Client } from "pg";

function assertLocalTarget(connectionString: string): void {
  const url = new URL(connectionString);
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (!["localhost", "127.0.0.1", "::1", "postgis"].includes(host) || url.pathname.slice(1) !== "mzizi_new") {
    throw new Error("Local role provisioning is restricted to local mzizi_new");
  }
}

/** Create least-privilege login roles for local services; migration/seed CLI credentials remain separate. */
export async function provisionLocalRoles(connectionString: string): Promise<void> {
  assertLocalTarget(connectionString);
  const url = new URL(connectionString);
  url.pathname = "/postgres";
  const client = new Client({ connectionString: url.toString() });
  await client.connect();
  try {
    const [{ database }] = (await client.query("SELECT current_database() AS database")).rows;
    if (database !== "postgres") throw new Error("Role provisioning must connect through the postgres administration database");
    for (const [login, group] of [["database_runtime", "mzizi_database_runtime"], ["api_reader", "mzizi_api_reader"]] as const) {
      await client.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${login}') THEN CREATE ROLE ${login} LOGIN; END IF; END $$`);
      await client.query(`ALTER ROLE ${login} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION`);
      await client.query(`GRANT ${group} TO ${login}`);
      await client.query(`GRANT CONNECT ON DATABASE mzizi_new TO ${login}`);
    }
  } finally {
    await client.end();
  }
}
