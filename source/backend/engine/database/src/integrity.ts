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
  { from: "source.captures.assessmentId", to: "website.assessments" },
  { from: "website.assessments.supersedesId", to: "website.assessments" },
  { from: "website.dossiers.supersedesId", to: "website.dossiers" },
  { from: "source.documents.siteId", to: "website.sites" },
  { from: "source.publishers.kindId", to: "reference.classifications" },
  { from: "source.documents.kindId", to: "reference.classifications" },
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
  // Places, occupancy and expected presence (PLACES_AND_PRESENCE_ASSESSMENT.md). The tree and its occupancies keep real
  // foreign keys only where both ends are in schema place; everything else is checked here.
  { from: "place.places.parentId", to: "place.places" },
  { from: "place.places.buildingTypeId", to: "reference.classifications" },
  { from: "place.places.locatedInUnitId", to: "geography.units" },
  { from: "place.occupancies.roleId", to: "reference.classifications" },
  { from: "place.occupancy_links.successorId", to: "place.occupancies" },
  { from: "place.expectations.roleId", to: "reference.classifications" },
  { from: "place.expectations.facilityTypeId", to: "reference.classifications" },
  { from: "place.expectations.scopeGeoUnitId", to: "geography.units" },
  { from: "place.expectations.resolvedOccupancyId", to: "place.occupancies" },
];

/**
 * Tables whose rows name a subject or scope by (kind, id) under differently named columns. The kind must be a stored
 * table and the row must exist, exactly as for `targetKindTables`.
 */
export const subjectRefs: Array<{ table: string; kind: string; id: string }> = [
  { table: "place.occupancies", kind: "subjectKind", id: "subjectId" },
  { table: "place.expectations", kind: "subjectKind", id: "subjectId" },
  { table: "contact.points", kind: "scopeKind", id: "scopeId" },
];

/** Column names that would put an address, a coordinate or a place into an expectation, which only says where a presence should be. */
const forbiddenExpectationColumns = /address|street|postal|latitude|longitude|place_id|building|box/;

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
  // Staging candidates are a legal review target (the API accepts that one extra kind); they are not entities.
  const known = new Set([...db.entityMetadatas.map(qualified), "staging.candidates"]);
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
      if (kind === "staging.candidates") {
        push(await orphans(db, `${name} (${kind}) -> ${kind}`, `FROM "${meta.schema}"."${meta.tableName}" f WHERE f."${kindCol}" = $1 AND NOT EXISTS (SELECT 1 FROM staging.candidates t WHERE t.id = f."${idCol}")`, [kind]));
        continue;
      }
      const target = table(db, kind);
      push(await orphans(db, `${name} (${kind}) -> ${kind}`, `FROM "${meta.schema}"."${meta.tableName}" f WHERE f."${kindCol}" = $1 AND NOT EXISTS (SELECT 1 FROM "${target.schema}"."${target.tableName}" t WHERE t.id = f."${idCol}")`, [kind]));
    }
  }

  // Subjects and scopes named by (kind, id) under their own column names.
  for (const ref of subjectRefs) {
    const meta = table(db, ref.table);
    const kindCol = column(meta, ref.kind);
    const idCol = column(meta, ref.id);
    const kinds: Array<{ kind: string }> = await db.query(`SELECT DISTINCT "${kindCol}" AS kind FROM "${meta.schema}"."${meta.tableName}"`);
    for (const { kind } of kinds) {
      if (!known.has(kind) || kind === "staging.candidates") {
        const [{ count }] = await db.query(`SELECT count(*)::int AS count FROM "${meta.schema}"."${meta.tableName}" WHERE "${kindCol}" = $1`, [kind]);
        issues.push({ rule: `${ref.table}.${ref.kind} names no stored table`, count, samples: [kind] });
        continue;
      }
      const target = table(db, kind);
      push(await orphans(db, `${ref.table} (${kind}) -> ${kind}`, `FROM "${meta.schema}"."${meta.tableName}" f WHERE f."${kindCol}" = $1 AND NOT EXISTS (SELECT 1 FROM "${target.schema}"."${target.tableName}" t WHERE t.id = f."${idCol}")`, [kind]));
    }
  }

  // Place tree: sites are roots and everything else sits in a place; no cycles; a point has both coordinates.
  push(await orphans(db, "places that are not sites and have no parent", `FROM place.places f WHERE f.kind <> 'site' AND f.parent_id IS NULL`));
  push(await orphans(db, "sites that have a parent", `FROM place.places f WHERE f.kind = 'site' AND f.parent_id IS NOT NULL`));
  push(await orphans(db, "places inside a cycle", `FROM place.places f WHERE EXISTS (WITH RECURSIVE up(id, parent_id) AS (SELECT p.id, p.parent_id FROM place.places p WHERE p.id = f.id UNION SELECT p.id, p.parent_id FROM place.places p JOIN up ON p.id = up.parent_id) SELECT 1 FROM up WHERE up.parent_id = f.id)`));
  push(await orphans(db, "places with half a point or a point out of range", `FROM place.places f WHERE (f.latitude IS NULL) <> (f.longitude IS NULL) OR f.latitude NOT BETWEEN -90 AND 90 OR f.longitude NOT BETWEEN -180 AND 180`));

  // Occupancy: periods are ordered, an active use is not in a place that is gone, and links form a coherent move, split or merge.
  push(await orphans(db, "occupancies that end before they start", `FROM place.occupancies f WHERE f.valid_to IS NOT NULL AND f.valid_from IS NOT NULL AND f.valid_to < f.valid_from`));
  push(await orphans(db, "active occupancies of a closed or demolished place", `FROM place.occupancies f JOIN place.places p ON p.id = f.place_id WHERE f.status = 'active' AND f.valid_to IS NULL AND p.status IN ('closed', 'demolished')`));
  push(await orphans(db, "occupancy links from an occupancy to itself", `FROM place.occupancy_links f WHERE f.predecessor_id = f.successor_id`));
  push(await orphans(db, "moved occupancies without a successor link", `FROM place.occupancies f WHERE f.status = 'moved' AND NOT EXISTS (SELECT 1 FROM place.occupancy_links l WHERE l.predecessor_id = f.id)`));
  push(await orphans(db, "occupancy links of kind move that leave one occupancy with several successors", `FROM place.occupancy_links f WHERE f.kind = 'move' AND (SELECT count(*) FROM place.occupancy_links l WHERE l.predecessor_id = f.predecessor_id) > 1`));
  push(await orphans(db, "split links whose predecessor has one successor", `FROM place.occupancy_links f WHERE f.kind = 'split' AND (SELECT count(*) FROM place.occupancy_links l WHERE l.predecessor_id = f.predecessor_id) < 2`));
  push(await orphans(db, "merge links whose successor has one predecessor", `FROM place.occupancy_links f WHERE f.kind = 'merge' AND (SELECT count(*) FROM place.occupancy_links l WHERE l.successor_id = f.successor_id) < 2`));

  // Expectation: cardinality is ordered, an identified expectation is resolved by an occupancy of the same subject and role, and no other one is.
  push(await orphans(db, "expectations with a maximum below the minimum", `FROM place.expectations f WHERE f.max_count IS NOT NULL AND f.max_count < f.min_count`));
  push(await orphans(db, "identified expectations without a resolving occupancy", `FROM place.expectations f WHERE f.status = 'identified' AND f.resolved_occupancy_id IS NULL`));
  push(await orphans(db, "expectations resolved by an occupancy while not identified", `FROM place.expectations f WHERE f.status <> 'identified' AND f.resolved_occupancy_id IS NOT NULL`));
  push(await orphans(db, "expectations resolved by an occupancy of another subject or role", `FROM place.expectations f JOIN place.occupancies o ON o.id = f.resolved_occupancy_id WHERE o.subject_kind <> f.subject_kind OR o.subject_id <> f.subject_id OR o.role_id <> f.role_id`));
  const expectation = table(db, "place.expectations");
  const holdsAddress = expectation.columns.filter((candidate) => forbiddenExpectationColumns.test(candidate.databaseName)).map((candidate) => candidate.databaseName);
  if (holdsAddress.length > 0) issues.push({ rule: "place.expectations holds an address, point or place", count: holdsAddress.length, samples: holdsAddress });

  // Evidence for the physical layer: every place and occupancy has an attribution (an expectation is never evidence of a building), and an
  // expectation counts as identified only through an occupancy that has one, and that is still in force.
  push(await orphans(db, "places without an attribution", `FROM place.places f WHERE NOT EXISTS (SELECT 1 FROM source.attributions a WHERE a.target_kind = 'place.places' AND a.target_id = f.id)`));
  push(await orphans(db, "occupancies without an attribution", `FROM place.occupancies f WHERE NOT EXISTS (SELECT 1 FROM source.attributions a WHERE a.target_kind = 'place.occupancies' AND a.target_id = f.id)`));
  push(await orphans(db, "expectations resolved by an occupancy without an attribution", `FROM place.expectations f JOIN place.occupancies o ON o.id = f.resolved_occupancy_id WHERE NOT EXISTS (SELECT 1 FROM source.attributions a WHERE a.target_kind = 'place.occupancies' AND a.target_id = o.id)`));
  push(await orphans(db, "expectations resolved by an occupancy that has moved or closed", `FROM place.expectations f JOIN place.occupancies o ON o.id = f.resolved_occupancy_id WHERE f.is_current AND o.status IN ('moved', 'closed')`));
  push(await orphans(db, "occupancies in a place that does not exist", `FROM place.occupancies f WHERE NOT EXISTS (SELECT 1 FROM place.places p WHERE p.id = f.place_id)`));

  // Generated rows must match the newest version of the pattern that generated them (a pattern version is a registered document titled
  // "Office pattern <id> version <n>"; a current row attributed to a version that a newer one replaced should have been retired or re-attributed).
  for (const kind of ["place.expectations", "governance.offices", "governance.institutions"]) {
    const t = table(db, kind);
    push(
      await orphans(
        db,
        `${kind} rows generated by a pattern but not matching its newest version`,
        `FROM "${t.schema}"."${t.tableName}" f WHERE f.is_current AND EXISTS (
           SELECT 1 FROM source.attributions a JOIN source.documents d ON d.id = a.document_id WHERE a.target_kind = $1 AND a.target_id = f.id AND d.title ~ '^Office pattern .+ version [0-9]+$')
         AND NOT EXISTS (
           SELECT 1 FROM source.attributions a JOIN source.documents d ON d.id = a.document_id
            WHERE a.target_kind = $1 AND a.target_id = f.id AND d.title ~ '^Office pattern .+ version [0-9]+$'
              AND NOT EXISTS (SELECT 1 FROM source.documents n WHERE n.title ~ '^Office pattern .+ version [0-9]+$' AND regexp_replace(n.title, ' version [0-9]+$', '') = regexp_replace(d.title, ' version [0-9]+$', '')
                                AND substring(n.title from ' version ([0-9]+)$')::int > substring(d.title from ' version ([0-9]+)$')::int))`,
        [kind],
      ),
    );
  }

  // Contacts: a person's contact is never public, and a public contact names its source.
  push(await orphans(db, "contact points of a person that are not restricted", `FROM contact.points f WHERE f.scope_kind LIKE 'person.%' AND f.visibility <> 'restricted'`));
  push(await orphans(db, "public contact points without an attribution", `FROM contact.points f WHERE f.visibility = 'public' AND NOT EXISTS (SELECT 1 FROM source.attributions a WHERE a.target_kind = 'contact.points' AND a.target_id = f.id)`));

  // Legal gate records: one current assessment per site and per jurisdiction dossier, and every site capture covered by an assessment of the same site.
  push(await orphans(db, "sites with more than one current assessment", `FROM website.sites f WHERE (SELECT count(*) FROM website.assessments a WHERE a.site_id = f.id AND a.is_current) > 1`));
  push(await orphans(db, "jurisdictions with more than one current dossier", `FROM reference.jurisdictions f WHERE (SELECT count(*) FROM website.dossiers d WHERE d.jurisdiction_id = f.id AND d.is_current) > 1`));
  push(await orphans(db, "captures of a site without a covering assessment", `FROM source.captures f WHERE f.site_id IS NOT NULL AND f.assessment_id IS NULL`));
  push(await orphans(db, "captures whose assessment belongs to another site", `FROM source.captures f JOIN website.assessments a ON a.id = f.assessment_id WHERE f.site_id IS NOT NULL AND a.site_id <> f.site_id`));

  // A site has at most one primary domain at any time (valid ranges are half-open and a null end is open).
  push(await orphans(db, "sites with overlapping primary domains", `FROM website.domains f JOIN website.domains o ON o.site_id = f.site_id AND o.id <> f.id AND o.role = 'primary' WHERE f.role = 'primary' AND f.valid_from < COALESCE(o.valid_to, 'infinity'::date) AND o.valid_from < COALESCE(f.valid_to, 'infinity'::date)`));

  // Jurisdiction-wide scope (DEC-JURISDICTION-WIDE-SCOPE): a record of a jurisdiction that has a single root unit must carry a scope.
  const rootCount = `(SELECT count(*) FROM geography.units r WHERE r.jurisdiction_id = JID AND r.parent_id IS NULL AND r.is_current) = 1`;
  push(await orphans(db, "institutions of a jurisdiction with a root unit but no scope", `FROM governance.institutions f WHERE f.is_current AND f.scope_geo_unit_id IS NULL AND ${rootCount.replace("JID", "f.jurisdiction_id")}`));
  push(await orphans(db, "offices of a jurisdiction with a root unit but no scope", `FROM governance.offices f JOIN governance.institutions i ON i.id = f.institution_id WHERE f.is_current AND f.scope_geo_unit_id IS NULL AND ${rootCount.replace("JID", "i.jurisdiction_id")}`));
  push(await orphans(db, "finance units of a jurisdiction with a root unit but no geography unit", `FROM finance.units f WHERE f.is_current AND f.geo_unit_id IS NULL AND ${rootCount.replace("JID", "f.jurisdiction_id")}`));
  push(await orphans(db, "statistical datasets of a jurisdiction with a root unit but no geography unit", `FROM statistical.datasets f WHERE f.is_current AND f.geo_unit_id IS NULL AND ${rootCount.replace("JID", "f.jurisdiction_id")}`));

  // Derived geometry: every boundary has a shape and every shape is valid.
  push(await orphans(db, "geography.boundaries without a valid derived shape", `FROM geography.boundaries f LEFT JOIN geography.boundary_shapes s ON s.boundary_id = f.id WHERE s.boundary_id IS NULL OR s.geom IS NULL OR s.is_valid IS NOT TRUE`));
  return issues;
}
