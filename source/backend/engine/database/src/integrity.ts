import type { DataSource, EntityMetadata } from "typeorm";

export interface IntegrityIssue {
  rule: string;
  count: number;
  samples: string[];
}

/**
 * Cross-schema references are plain ids with no foreign key (DATABASE_DESIGN.md), so the database
 * does not enforce them; these checks do. `from` is `schema.table.property`, `to` is `schema.table`.
 */
export const softLinks: Array<{ from: string; to: string }> = [
  { from: "source.captures.siteId", to: "website.sites" },
  { from: "source.captures.domainId", to: "website.domains" },
  { from: "source.captures.structureVersionId", to: "website.structure_versions" },
  { from: "source.captures.familyVersionId", to: "website.structure_versions" },
  { from: "source.captures.fileVersionId", to: "filesystem.versions" },
  { from: "source.documents.siteId", to: "website.sites" },
  { from: "source.attributions.captureId", to: "source.captures" },
  { from: "source.attributions.methodId", to: "source.methods" },
  { from: "website.site_publishers.publisherId", to: "source.publishers" },
  { from: "website.structures.currentVersionId", to: "website.structure_versions" },
  { from: "website.structure_versions.folderId", to: "filesystem.folders" },
  { from: "website.structure_versions.methodId", to: "source.methods" },
  { from: "website.structure_versions.supersedesId", to: "website.structure_versions" },
  { from: "website.structure_files.versionId", to: "website.structure_versions" },
  { from: "website.structure_files.fileVersionId", to: "filesystem.versions" },
  { from: "website.checks.structureVersionId", to: "website.structure_versions" },
  { from: "website.members.familyId", to: "website.families" },
  { from: "website.fingerprints.checkId", to: "website.checks" },
];

/** Tables whose rows point at any record by (target_kind, target_id). */
export const targetKindTables = ["source.attributions", "source.verifications", "audit.comments", "audit.evidence", "audit.decisions", "filesystem.attachments", "website.subjects"];

const qualified = (meta: EntityMetadata) => `${meta.schema}.${meta.tableName}`;

function table(db: DataSource, name: string): EntityMetadata {
  const meta = db.entityMetadatas.find((candidate) => qualified(candidate) === name);
  if (!meta) throw new Error(`integrity registry is stale: no entity stored as ${name}`);
  return meta;
}

function column(meta: EntityMetadata, property: string): string {
  const found = meta.columns.find((candidate) => candidate.propertyName === property);
  if (!found) throw new Error(`integrity registry is stale: ${qualified(meta)} has no property ${property}`);
  return found.databaseName;
}

async function orphans(db: DataSource, rule: string, sql: string, params: unknown[] = []): Promise<IntegrityIssue | undefined> {
  const rows: Array<{ id: string }> = await db.query(`SELECT f.id::text AS id ${sql} LIMIT 6`, params);
  if (rows.length === 0) return undefined;
  const [{ count }] = await db.query(`SELECT count(*)::int AS count ${sql}`, params);
  return { rule, count, samples: rows.slice(0, 5).map((row) => row.id) };
}

export async function checkIntegrity(db: DataSource): Promise<IntegrityIssue[]> {
  const issues: IntegrityIssue[] = [];
  const push = (issue: IntegrityIssue | undefined) => issue && issues.push(issue);

  // Declared soft links.
  for (const link of softLinks) {
    const [schema, tableName, property] = [link.from.split(".")[0], link.from.split(".")[1], link.from.split(".")[2]];
    const from = table(db, `${schema}.${tableName}`);
    const to = table(db, link.to);
    const col = column(from, property!);
    push(await orphans(db, `${link.from} -> ${link.to}`, `FROM "${from.schema}"."${from.tableName}" f WHERE f."${col}" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM "${to.schema}"."${to.tableName}" t WHERE t.id = f."${col}")`));
  }

  // Every jurisdiction reference, in any schema, must resolve.
  const jurisdictions = table(db, "reference.jurisdictions");
  for (const meta of db.entityMetadatas) {
    for (const col of meta.columns.filter((candidate) => candidate.databaseName === "jurisdiction_id")) {
      push(await orphans(db, `${qualified(meta)}.${col.propertyName} -> reference.jurisdictions`, `FROM "${meta.schema}"."${meta.tableName}" f WHERE f."jurisdiction_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM "${jurisdictions.schema}"."${jurisdictions.tableName}" t WHERE t.id = f."jurisdiction_id")`));
    }
  }

  // (target_kind, target_id) references: the kind must name a stored table and the row must exist.
  const known = new Set(db.entityMetadatas.map(qualified));
  for (const name of targetKindTables) {
    const meta = table(db, name);
    const kindCol = column(meta, "targetKind");
    const idCol = column(meta, "targetId");
    const kinds: Array<{ kind: string }> = await db.query(`SELECT DISTINCT "${kindCol}" AS kind FROM "${meta.schema}"."${meta.tableName}"`);
    for (const { kind } of kinds) {
      if (!known.has(kind)) {
        const [{ count }] = await db.query(`SELECT count(*)::int AS count FROM "${meta.schema}"."${meta.tableName}" WHERE "${kindCol}" = $1`, [kind]);
        issues.push({ rule: `${name}.targetKind names no stored table`, count, samples: [kind] });
        continue;
      }
      const target = table(db, kind);
      push(await orphans(db, `${name} (${kind}) -> ${kind}`, `FROM "${meta.schema}"."${meta.tableName}" f WHERE f."${kindCol}" = $1 AND NOT EXISTS (SELECT 1 FROM "${target.schema}"."${target.tableName}" t WHERE t.id = f."${idCol}")`, [kind]));
    }
  }

  // Derived geometry: every boundary has a shape and every shape is valid.
  push(await orphans(db, "geography.boundaries without a valid derived shape", `FROM geography.boundaries f LEFT JOIN geography.boundary_shapes s ON s.boundary_id = f.id WHERE s.boundary_id IS NULL OR s.geom IS NULL OR s.is_valid IS NOT TRUE`));
  return issues;
}
