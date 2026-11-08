import type { DataSource } from "typeorm";

/**
 * Evidence-based backfills for the governance generalisation (TSK-AA0A323E646D). Nothing is guessed: a link is written only
 * when exactly one candidate matches by a stated rule, and everything else is returned as unmatched. Idempotent.
 *
 * - Office scope: a seat code `ke/senate/<county>` or `ke/national-assembly/<constituency>` names the unit it represents. The slug
 *   must equal the last segment of exactly one unit code of the right level (county, constituency).
 * - Whole-jurisdiction scope: an institution with no scope is pointed at its jurisdiction's root unit; an office with no scope after the
 *   rule above is pointed at the root unit of its institution's jurisdiction. Null is never "national".
 * - Institution entity: an institution gets `entity_id` when exactly one procuring-entity organisation (`<jurisdiction>/pe/...`)
 *   has the same official name, ignoring case and surrounding space. Suppliers with the same name are different records and ignored.
 */
export interface BackfillReport {
  officesScoped: number;
  officesUnmatched: string[];
  institutionsLinked: number;
  institutionsAmbiguous: string[];
  institutionsUnmatched: number;
  /** Whole-jurisdiction scope (DEC-JURISDICTION-WIDE-SCOPE): rows pointed at the jurisdiction's root unit. */
  institutionsRootScoped: number;
  officesRootScoped: number;
  /** Rows left without scope because their jurisdiction has no single root unit. */
  scopeGaps: number;
}

export async function backfillGovernance(db: DataSource): Promise<BackfillReport> {
  const officesScoped = (await db.query(`
    WITH cand AS (
      SELECT o.id AS office_id,
             (SELECT array_agg(u.id) FROM geography.units u JOIN reference.classifications l ON l.id = u.level_id
               WHERE l.label = CASE WHEN o.code LIKE 'ke/senate/%' THEN 'county' ELSE 'constituency' END
                 AND split_part(u.code, '/', array_length(string_to_array(u.code, '/'), 1)) = split_part(o.code, '/', 3)
                 AND u.is_current) AS units
        FROM governance.offices o
       WHERE o.scope_geo_unit_id IS NULL AND o.is_current
         AND ((o.code LIKE 'ke/senate/%' AND o.code NOT LIKE 'ke/senate/nominated/%' AND array_length(string_to_array(o.code, '/'), 1) = 3)
           OR (o.code LIKE 'ke/national-assembly/%' AND o.code NOT LIKE 'ke/national-assembly/nominated/%' AND array_length(string_to_array(o.code, '/'), 1) = 3))
    ), upd AS (
      UPDATE governance.offices o SET scope_geo_unit_id = c.units[1], updated_at = now(), version = o.version + 1
        FROM cand c WHERE c.office_id = o.id AND array_length(c.units, 1) = 1 RETURNING o.id
    ) SELECT count(*)::int AS n FROM upd`))[0].n;
  // A seat with the holder in its code (ke/national-assembly/<slug>/<person>) names a constituency only when no county shares the slug
  // (a county slug may be the county's woman representative, which would be a guess).
  const officesScoped2 = (await db.query(`
    WITH cand AS (
      SELECT o.id AS office_id,
             (SELECT array_agg(u.id) FROM geography.units u JOIN reference.classifications l ON l.id = u.level_id
               WHERE l.label = 'constituency' AND u.is_current AND split_part(u.code, '/', 3) = split_part(o.code, '/', 3)) AS units,
             (SELECT count(*) FROM geography.units c JOIN reference.classifications cl ON cl.id = c.level_id
               WHERE cl.label = 'county' AND c.is_current AND split_part(c.code, '/', 2) = split_part(o.code, '/', 3)) AS counties
        FROM governance.offices o
       WHERE o.scope_geo_unit_id IS NULL AND o.is_current AND o.code ~ '^ke/national-assembly/[^/]+/[^/]+$'
         AND split_part(o.code, '/', 3) NOT IN ('nominated', 'elect')
    ), upd AS (
      UPDATE governance.offices o SET scope_geo_unit_id = c.units[1], updated_at = now(), version = o.version + 1
        FROM cand c WHERE c.office_id = o.id AND array_length(c.units, 1) = 1 AND c.counties = 0 RETURNING o.id
    ) SELECT count(*)::int AS n FROM upd`))[0].n;
  // A seat code ke/national-assembly/<slug> that matches no constituency but exactly one county names that county's seat (the woman representative).
  const officesCounty = (await db.query(`
    WITH cand AS (
      SELECT o.id AS office_id,
             (SELECT array_agg(c.id) FROM geography.units c JOIN reference.classifications cl ON cl.id = c.level_id
               WHERE cl.label = 'county' AND c.is_current AND split_part(c.code, '/', 2) = split_part(o.code, '/', 3)) AS counties,
             (SELECT count(*) FROM geography.units u JOIN reference.classifications l ON l.id = u.level_id
               WHERE l.label = 'constituency' AND u.is_current AND split_part(u.code, '/', 3) = split_part(o.code, '/', 3)) AS constituencies
        FROM governance.offices o
       WHERE o.scope_geo_unit_id IS NULL AND o.is_current AND o.code ~ '^ke/national-assembly/[^/]+$' AND o.code !~ '^ke/national-assembly/(nominated|elect)$'
    ), upd AS (
      UPDATE governance.offices o SET scope_geo_unit_id = c.counties[1], updated_at = now(), version = o.version + 1
        FROM cand c WHERE c.office_id = o.id AND array_length(c.counties, 1) = 1 AND c.constituencies = 0 RETURNING o.id
    ) SELECT count(*)::int AS n FROM upd`))[0].n;
  const officesUnmatched: string[] = (await db.query(`
    SELECT code FROM governance.offices WHERE scope_geo_unit_id IS NULL AND is_current
       AND code ~ '^ke/(senate|national-assembly)/[^/]+(/[^/]+)?$' AND code !~ '/nominated(/|$)' AND code !~ '^ke/national-assembly/elect/' ORDER BY code`)).map((r: { code: string }) => r.code);

  const rows: Array<{ id: string; code: string; entities: string[] }> = await db.query(`
    SELECT i.id, i.code, array_agg(e.id) AS entities
      FROM governance.institutions i
      JOIN organization.entities e ON lower(trim(e.official_name)) = lower(trim(i.name)) AND e.code LIKE '%/pe/%' AND e.is_current
     WHERE i.entity_id IS NULL AND i.is_current GROUP BY i.id, i.code`);
  let institutionsLinked = 0;
  const institutionsAmbiguous: string[] = [];
  for (const row of rows) {
    if (row.entities.length !== 1) {
      institutionsAmbiguous.push(row.code);
      continue;
    }
    await db.query(`UPDATE governance.institutions SET entity_id = $1, updated_at = now(), version = version + 1 WHERE id = $2`, [row.entities[0], row.id]);
    institutionsLinked++;
  }
  const [{ n }] = await db.query(`SELECT count(*)::int AS n FROM governance.institutions WHERE entity_id IS NULL AND is_current`);
  const institutionsRootScoped = (await db.query(`
    WITH upd AS (UPDATE governance.institutions i SET scope_geo_unit_id = (SELECT r.id FROM geography.units r WHERE r.jurisdiction_id = i.jurisdiction_id AND r.parent_id IS NULL AND r.is_current), updated_at = now(), version = i.version + 1
      WHERE i.scope_geo_unit_id IS NULL AND i.is_current AND (SELECT count(*) FROM geography.units r WHERE r.jurisdiction_id = i.jurisdiction_id AND r.parent_id IS NULL AND r.is_current) = 1 RETURNING 1)
    SELECT count(*)::int AS n FROM upd`))[0].n;
  const officesRootScoped = (await db.query(`
    WITH upd AS (UPDATE governance.offices o SET scope_geo_unit_id = i.scope_geo_unit_id, updated_at = now(), version = o.version + 1
      FROM governance.institutions i WHERE i.id = o.institution_id AND o.scope_geo_unit_id IS NULL AND o.is_current AND i.scope_geo_unit_id IS NOT NULL
        AND NOT (o.code ~ '^ke/(senate|national-assembly)/[^/]+(/[^/]+)?$' AND o.code !~ '/nominated(/|$)' AND o.code !~ '^ke/national-assembly/elect/')
        AND i.scope_geo_unit_id = (SELECT r.id FROM geography.units r WHERE r.jurisdiction_id = i.jurisdiction_id AND r.parent_id IS NULL AND r.is_current) RETURNING 1)
    SELECT count(*)::int AS n FROM upd`))[0].n;
  const [{ gaps }] = await db.query(`SELECT ((SELECT count(*) FROM governance.institutions WHERE scope_geo_unit_id IS NULL AND is_current) + (SELECT count(*) FROM governance.offices WHERE scope_geo_unit_id IS NULL AND is_current))::int AS gaps`);
  return { institutionsRootScoped, officesRootScoped, scopeGaps: gaps, officesScoped: officesScoped + officesScoped2 + officesCounty, officesUnmatched, institutionsLinked, institutionsAmbiguous, institutionsUnmatched: n };
}
