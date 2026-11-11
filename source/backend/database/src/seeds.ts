/** TypeScript-owned, additive loaders for reviewed root seed inputs. */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { DataSource } from "typeorm";

const repository = resolve(import.meta.dir, "../../../..");
const seedRoot = resolve(process.env.MZIZI_SEED_ROOT ?? resolve(repository, "seed"));

function csv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i]!;
    if (quoted && char === '"' && text[i + 1] === '"') { cell += '"'; i++; }
    else if (char === '"') quoted = !quoted;
    else if (!quoted && char === ",") { row.push(cell); cell = ""; }
    else if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((value) => value.length)) rows.push(row);
      row = [];
    } else cell += char;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  if (!rows.length) return [];
  const [header, ...records] = rows;
  if (!header?.length) return [];
  return records.map((values) => Object.fromEntries(header.map((key, index) => [key, values[index] ?? ""])));
}

async function records(path: string): Promise<Record<string, string>[]> {
  return csv(await readFile(resolve(seedRoot, path), "utf8"));
}

export async function seedAuth(connectionString: string): Promise<Record<string, number>> {
  const roles = await records("global/auth/roles.csv");
  const namespaces = await records("global/auth/namespaces.csv");
  const bundles = await records("global/auth/role-permissions.csv");
  const targets = await records("global/auth/scope-targets.csv");
  const governed = await records("global/auth/governed-tables.csv");
  const db = new DataSource({ type: "postgres", url: connectionString, entities: [], synchronize: false, migrationsRun: false });
  await db.initialize();
  try {
    return await db.transaction(async (tx) => {
      const before = await tx.query(`SELECT (SELECT count(*) FROM auth.roles) AS roles,
        (SELECT count(DISTINCT namespace) FROM auth.permissions) AS namespaces,
        (SELECT count(*) FROM auth.role_permissions) AS bundles,
        (SELECT count(*) FROM auth.scope_targets) + (SELECT count(*) FROM auth.governed_tables) AS targets`);
      for (const role of roles) await tx.query(`INSERT INTO auth.roles(code,name) VALUES($1,$2)
        ON CONFLICT(code) DO UPDATE SET name=EXCLUDED.name`, [role.code, role.name]);
      for (const namespace of namespaces) await tx.query("SELECT auth.register_namespace($1)", [namespace.namespace]);
      for (const bundle of bundles) {
        if (!bundle.permission?.includes(".")) throw new Error("role-permissions.csv contains an invalid permission");
        const [namespace, action] = bundle.permission.split(".");
        if (!namespace || !action) throw new Error("role-permissions.csv contains an invalid permission");
        const [known] = await tx.query(`SELECT 1 FROM auth.roles r,auth.permissions p WHERE r.code=$1 AND p.namespace=$2 AND ($3='*' OR p.action=$3) LIMIT 1`,
          [bundle.role_code, namespace, action]);
        if (!known) throw new Error(`role-permissions.csv: ${bundle.role_code} / ${bundle.permission} matches no registered role or permission`);
        await tx.query(`INSERT INTO auth.role_permissions SELECT r.id,p.namespace,p.action FROM auth.roles r,auth.permissions p
          WHERE r.code=$1 AND p.namespace=$2 AND ($3='*' OR p.action=$3) ON CONFLICT DO NOTHING`, [bundle.role_code, namespace, action]);
      }
      for (const target of targets) {
        const [known] = await tx.query("SELECT 1 FROM auth.scope_targets WHERE table_name=$1", [target.table_name]);
        if (!known) await tx.query("SELECT auth.register_scope_target($1,$2)", [target.table_name, target.parent_column || null]);
      }
      for (const table of governed) {
        const [known] = await tx.query("SELECT 1 FROM auth.governed_tables WHERE table_name=$1", [table.table_name]);
        if (!known) await tx.query("SELECT auth.register_governed_table($1,$2,$3,$4)", [table.table_name, table.namespace, table.link_table, table.link_column]);
      }
      const [after] = await tx.query(`SELECT (SELECT count(*) FROM auth.roles) AS roles,
        (SELECT count(DISTINCT namespace) FROM auth.permissions) AS namespaces,
        (SELECT count(*) FROM auth.role_permissions) AS bundles,
        (SELECT count(*) FROM auth.scope_targets) + (SELECT count(*) FROM auth.governed_tables) AS targets`);
      return Object.fromEntries(Object.keys(before[0]).map((key) => [key, Number(after[key]) - Number(before[0][key])]));
    });
  } finally { await db.destroy(); }
}

export async function seedReference(connectionString: string): Promise<Record<string, number>> {
  const data = JSON.parse(await readFile(resolve(seedRoot, "global/reference/foundation-baseline.json"), "utf8")) as Record<string, any>;
  if (data.schema_version !== 1 || data.review !== "structure_only") throw new Error("unsupported or unreviewed reference seed");
  const db = new DataSource({ type: "postgres", url: connectionString, entities: [], synchronize: false, migrationsRun: false });
  await db.initialize();
  try {
    return await db.transaction(async (tx) => {
      const counts = { schemes: 0, values: 0, topics: 0 };
      for (const row of data.schemes) {
        const [current] = await tx.query("SELECT name,description,owner,country_id AS \"countryId\" FROM reference.schemes WHERE code=$1", [row.code]);
        if (current && (current.name !== row.name || current.description !== row.description || current.owner !== row.owner || current.countryId !== null)) throw new Error(`reference scheme conflict: ${row.code}`);
        const [added] = await tx.query("INSERT INTO reference.schemes(code,name,description,owner) VALUES($1,$2,$3,$4) ON CONFLICT(code) DO NOTHING RETURNING id", [row.code, row.name, row.description, row.owner]);
        counts.schemes += Number(Boolean(added));
      }
      const schemeRows = await tx.query("SELECT id,code FROM reference.schemes");
      const schemes = new Map(schemeRows.map((row: { id: string; code: string }) => [row.code, row.id]));
      for (const row of data.values) {
        const schemeId = schemes.get(row.scheme);
        if (!schemeId) throw new Error(`unknown reference scheme: ${row.scheme}`);
        const [current] = await tx.query("SELECT scheme_id AS \"schemeId\",label,description FROM reference.values WHERE code=$1", [row.code]);
        if (current && (current.schemeId !== schemeId || current.label !== row.label || current.description !== row.description)) throw new Error(`reference value conflict: ${row.code}`);
        const [added] = await tx.query("INSERT INTO reference.values(code,scheme_id,label,description) VALUES($1,$2,$3,$4) ON CONFLICT(code) DO NOTHING RETURNING id", [row.code, schemeId, row.label, row.description]);
        counts.values += Number(Boolean(added));
      }
      for (const row of data.topics) {
        const [current] = await tx.query("SELECT name,description FROM reference.topics WHERE code=$1", [row.code]);
        if (current && (current.name !== row.name || current.description !== row.description)) throw new Error(`reference topic conflict: ${row.code}`);
        const [added] = await tx.query("INSERT INTO reference.topics(code,name,description) VALUES($1,$2,$3) ON CONFLICT(code) DO NOTHING RETURNING id", [row.code, row.name, row.description]);
        counts.topics += Number(Boolean(added));
      }
      return counts;
    });
  } finally { await db.destroy(); }
}

export async function bootstrapAdmin(connectionString: string, issuer: string, subject: string, displayName: string): Promise<string> {
  if (!issuer.trim() || !subject.trim() || !displayName.trim()) throw new Error("issuer, subject and display name are required");
  const db = new DataSource({ type: "postgres", url: connectionString, entities: [], synchronize: false, migrationsRun: false });
  await db.initialize();
  try {
    return await db.transaction(async (tx) => {
      const [existing] = await tx.query(`SELECT 1 FROM auth.role_assignments a JOIN auth.roles r ON r.id=a.role_id
        WHERE r.code='admin' AND a.revoked_at IS NULL LIMIT 1`);
      if (existing) throw new Error("an active administrator already exists");
      const [row] = await tx.query("SELECT auth.bootstrap_admin($1,$2,$3,'admin') AS id", [issuer, subject, displayName]);
      return row.id as string;
    });
  } finally { await db.destroy(); }
}
