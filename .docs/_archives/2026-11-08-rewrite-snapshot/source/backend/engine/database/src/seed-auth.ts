/**
 * Loader `auth.baseline`: applies seed/global/auth/ (roles, namespaces, role bundles, scope targets) to the auth schema.
 * Additive and idempotent: existing rows are kept, role names may be refreshed, nothing is ever deleted because a
 * file no longer lists it. All values are bound parameters; the files cannot run SQL.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type pg from "pg";

import { seedRoot } from "./config.ts";
import { parseCsv, parseYaml } from "./seed-manifest.ts";

type Queryable = Pick<pg.Client, "query">;

export function readCsvRecords(path: string): Record<string, string>[] {
  const [header, ...rows] = parseCsv(readFileSync(path, "utf8"));
  if (!header) throw new Error(`${path} is empty`);
  return rows.map((row) => Object.fromEntries(header.map((name, i) => [name, row[i] ?? ""])));
}

export interface AuthSeedResult {
  roles: number;
  namespaces: number;
  bundlePermissions: number;
  scopeTargets: number;
}

export async function applyAuthSeed(client: Queryable, root = seedRoot): Promise<AuthSeedResult> {
  const dir = join(root, "global", "auth");
  const roles = readCsvRecords(join(dir, "roles.csv"));
  const namespaces = readCsvRecords(join(dir, "namespaces.csv"));
  const bundles = readCsvRecords(join(dir, "role-permissions.csv"));
  const targets = readCsvRecords(join(dir, "scope-targets.csv"));
  const before = async (sql: string) => Number((await client.query(sql)).rows[0].n);
  const counts = {
    roles: await before(`SELECT count(*) AS n FROM auth.roles`),
    namespaces: await before(`SELECT count(DISTINCT namespace) AS n FROM auth.permissions`),
    bundles: await before(`SELECT count(*) AS n FROM auth.role_permissions`),
    targets: await before(`SELECT count(*) AS n FROM auth.scope_targets`),
  };
  await client.query("BEGIN");
  try {
    for (const role of roles) {
      await client.query(`INSERT INTO auth.roles (code, name) VALUES ($1, $2) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name`, [role.code, role.name]);
    }
    for (const namespace of namespaces) await client.query(`SELECT auth.register_namespace($1)`, [namespace.namespace]);
    for (const bundle of bundles) {
      const [ns, action] = bundle.permission!.split(".");
      const result = await client.query(
        `INSERT INTO auth.role_permissions SELECT r.id, p.namespace, p.action FROM auth.roles r, auth.permissions p
          WHERE r.code = $1 AND p.namespace = $2 AND ($3 = '*' OR p.action = $3) ON CONFLICT DO NOTHING`,
        [bundle.role_code, ns, action],
      );
      const known = await client.query(`SELECT 1 FROM auth.roles r, auth.permissions p WHERE r.code = $1 AND p.namespace = $2 AND ($3 = '*' OR p.action = $3)`, [bundle.role_code, ns, action]);
      if (!known.rowCount) throw new Error(`role-permissions.csv: ${bundle.role_code} / ${bundle.permission} matches no role or permission`);
      void result;
    }
    for (const target of targets) {
      const exists = await client.query(`SELECT 1 FROM auth.scope_targets WHERE table_name = $1`, [target.table_name]);
      if (!exists.rowCount) await client.query(`SELECT auth.register_scope_target($1, $2)`, [target.table_name, target.parent_column || null]);
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
  const after = {
    roles: await before(`SELECT count(*) AS n FROM auth.roles`),
    namespaces: await before(`SELECT count(DISTINCT namespace) AS n FROM auth.permissions`),
    bundles: await before(`SELECT count(*) AS n FROM auth.role_permissions`),
    targets: await before(`SELECT count(*) AS n FROM auth.scope_targets`),
  };
  return { roles: after.roles - counts.roles, namespaces: after.namespaces - counts.namespaces, bundlePermissions: after.bundles - counts.bundles, scopeTargets: after.targets - counts.targets };
}

export interface BootstrapDefinition {
  role: string;
  scope: string;
  identity: { issuer_env: string; subject_env: string; display_name_env: string };
}
export const readBootstrap = (root = seedRoot): BootstrapDefinition => parseYaml<BootstrapDefinition>(readFileSync(join(root, "global", "auth", "bootstrap.yaml"), "utf8"));
