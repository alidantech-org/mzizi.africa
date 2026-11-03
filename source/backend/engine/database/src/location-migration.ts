import type { DataSource } from "typeorm";

/**
 * Moves organization.locations and the organisation contact identifiers into the place model (TSK-28DC592B1E17,
 * PLACES_AND_PRESENCE_ASSESSMENT.md section 10). One transaction; every count is verified before commit, otherwise nothing changes.
 *
 * - each location becomes a `place.places` site (name = the entity's official name, address text, located in the county unit) and a
 *   `place.occupancies` row (subject = the entity, role from the entity type, status active);
 * - the location's attributions and verifications move to the place; copies are written for the occupancy;
 * - each contact-phone / contact-email identifier becomes a `contact.points` row at entity scope with `restricted` visibility
 *   (the old identifiers were hidden from the public API); its attributions and verifications move to the contact point;
 * - the old contact identifiers are deleted. organization.locations itself is dropped by the next migration.
 *
 * Idempotent in effect: once any entity occupancy exists the function reports "already migrated" and changes nothing.
 */
export interface LocationMigrationReport {
  skipped?: string;
  locationsBefore: number;
  places: number;
  occupancies: number;
  contactIdentifiersBefore: number;
  contactPoints: number;
  attributionsMovedToPlaces: number;
  attributionsCopiedToOccupancies: number;
  verificationsMovedToPlaces: number;
  verificationsCopiedToOccupancies: number;
  contactAttributionsMoved: number;
  contactVerificationsMoved: number;
}

const ROLE_BY_TYPE: Record<string, string> = {
  "organization/entity-type/school": "school-campus",
  "organization/entity-type/tertiary-institution": "school-campus",
  "organization/entity-type/hospital": "service-site",
};
const DEFAULT_ROLE = "official-workplace";
const ROLE_LABELS: Record<string, string> = { "school-campus": "school campus", "service-site": "service site", "official-workplace": "official workplace" };

export async function migrateLocations(db: DataSource): Promise<LocationMigrationReport> {
  const empty: LocationMigrationReport = { locationsBefore: 0, places: 0, occupancies: 0, contactIdentifiersBefore: 0, contactPoints: 0, attributionsMovedToPlaces: 0, attributionsCopiedToOccupancies: 0, verificationsMovedToPlaces: 0, verificationsCopiedToOccupancies: 0, contactAttributionsMoved: 0, contactVerificationsMoved: 0 };
  const [{ present }] = await db.query(`SELECT to_regclass('organization.locations') IS NOT NULL AS present`);
  if (!present) return { ...empty, skipped: "organization.locations is already dropped" };
  const runner = db.createQueryRunner();
  await runner.connect();
  await runner.startTransaction();
  const q = (sql: string, args: unknown[] = []) => runner.query(sql, args);
  try {
    const [{ n: done }] = await q(`SELECT count(*)::int AS n FROM place.occupancies WHERE subject_kind = 'organization.entities'`);
    if (done > 0) {
      await runner.rollbackTransaction();
      return { ...empty, skipped: "already migrated (entity occupancies exist)" };
    }
    const [{ n: locationsBefore }] = await q(`SELECT count(*)::int AS n FROM organization.locations`);
    const [{ n: withKind }] = await q(`SELECT count(*)::int AS n FROM organization.locations WHERE kind_id IS NOT NULL`);
    if (withKind > 0) throw new Error(`${withKind} locations carry a kind_id, which the place model cannot hold yet; map them first`);
    const [{ n: contactBefore }] = await q(`SELECT count(*)::int AS n FROM organization.identifiers i JOIN reference.classifications s ON s.id = i.scheme_id WHERE s.code IN ('organization/identifier-scheme/contact-phone', 'organization/identifier-scheme/contact-email')`);

    // Roles, per jurisdiction of the entities that will occupy.
    const jurisdictions: Array<{ id: string }> = await q(`SELECT DISTINCT e.jurisdiction_id AS id FROM organization.locations l JOIN organization.entities e ON e.id = l.entity_id`);
    for (const { id } of jurisdictions) {
      for (const role of new Set([...Object.values(ROLE_BY_TYPE), DEFAULT_ROLE])) {
        await q(
          `INSERT INTO reference.classifications (code, scheme, label, jurisdiction_id, "order", is_current, created_at, updated_at, version)
           SELECT $1::varchar(200), 'place/occupancy-role', $2::varchar(300), $3::uuid, 0, true, now(), now(), 1
            WHERE NOT EXISTS (SELECT 1 FROM reference.classifications WHERE code = $1::varchar(200) AND jurisdiction_id = $3::uuid)`,
          [`place/occupancy-role/${role}`, ROLE_LABELS[role], id],
        );
      }
    }

    await q(`CREATE TEMP TABLE loc_map (location_id uuid PRIMARY KEY, place_id uuid NOT NULL, occupancy_id uuid NOT NULL) ON COMMIT DROP`);
    await q(`INSERT INTO loc_map SELECT id, uuid_generate_v4(), uuid_generate_v4() FROM organization.locations`);
    await q(
      `INSERT INTO place.places (id, kind, status, name, address_text, located_in_unit_id, valid_from, valid_from_precision, valid_to, valid_to_precision, is_current, created_at, updated_at, version)
       SELECT m.place_id, 'site', 'in_use', left(e.official_name, 300), l.address_text, l.geo_unit_id, l.valid_from, l.valid_from_precision::text::place.places_valid_from_precision_enum,
              l.valid_to, l.valid_to_precision::text::place.places_valid_to_precision_enum, l.is_current, l.created_at, now(), 1
         FROM organization.locations l JOIN loc_map m ON m.location_id = l.id JOIN organization.entities e ON e.id = l.entity_id`,
    );
    await q(
      `INSERT INTO place.occupancies (id, subject_kind, subject_id, place_id, role_id, status, valid_from, valid_from_precision, valid_to, valid_to_precision, is_current, created_at, updated_at, version)
       SELECT m.occupancy_id, 'organization.entities', l.entity_id, m.place_id,
              (SELECT c.id FROM reference.classifications c WHERE c.jurisdiction_id = e.jurisdiction_id
                 AND c.code = 'place/occupancy-role/' || CASE t.code WHEN 'organization/entity-type/school' THEN 'school-campus' WHEN 'organization/entity-type/tertiary-institution' THEN 'school-campus'
                                                                     WHEN 'organization/entity-type/hospital' THEN 'service-site' ELSE 'official-workplace' END),
              'active', l.valid_from, l.valid_from_precision::text::place.occupancies_valid_from_precision_enum, l.valid_to, l.valid_to_precision::text::place.occupancies_valid_to_precision_enum, l.is_current, l.created_at, now(), 1
         FROM organization.locations l JOIN loc_map m ON m.location_id = l.id JOIN organization.entities e ON e.id = l.entity_id JOIN reference.classifications t ON t.id = e.entity_type_id`,
    );

    // Evidence: copy to the occupancy first, then move the original to the place.
    const [{ n: attrCopied }] = await q(
      `WITH c AS (INSERT INTO source.attributions (attributed_by, capture_id, confidence, created_at, document_id, locator, method_id, relation, target_field, target_id, target_kind, updated_at, version)
         SELECT a.attributed_by, a.capture_id, a.confidence, a.created_at, a.document_id, a.locator, a.method_id, a.relation, a.target_field, m.occupancy_id, 'place.occupancies', now(), 1
           FROM source.attributions a JOIN loc_map m ON m.location_id = a.target_id WHERE a.target_kind = 'organization.locations' RETURNING 1) SELECT count(*)::int AS n FROM c`);
    const [{ n: verCopied }] = await q(
      `WITH c AS (INSERT INTO source.verifications (created_at, decided_by, decision_id, is_current, rationale, state, target_id, target_kind, updated_at, version)
         SELECT v.created_at, v.decided_by, v.decision_id, v.is_current, v.rationale, v.state, m.occupancy_id, 'place.occupancies', now(), 1
           FROM source.verifications v JOIN loc_map m ON m.location_id = v.target_id WHERE v.target_kind = 'organization.locations' RETURNING 1) SELECT count(*)::int AS n FROM c`);
    const [{ n: attrMoved }] = await q(`WITH u AS (UPDATE source.attributions a SET target_kind = 'place.places', target_id = m.place_id FROM loc_map m WHERE a.target_kind = 'organization.locations' AND a.target_id = m.location_id RETURNING 1) SELECT count(*)::int AS n FROM u`);
    const [{ n: verMoved }] = await q(`WITH u AS (UPDATE source.verifications v SET target_kind = 'place.places', target_id = m.place_id FROM loc_map m WHERE v.target_kind = 'organization.locations' AND v.target_id = m.location_id RETURNING 1) SELECT count(*)::int AS n FROM u`);

    // Contact identifiers become contact points.
    await q(`CREATE TEMP TABLE contact_map (identifier_id uuid PRIMARY KEY, point_id uuid NOT NULL) ON COMMIT DROP`);
    await q(
      `INSERT INTO contact_map SELECT i.id, uuid_generate_v4() FROM organization.identifiers i JOIN reference.classifications s ON s.id = i.scheme_id
        WHERE s.code IN ('organization/identifier-scheme/contact-phone', 'organization/identifier-scheme/contact-email')`,
    );
    await q(
      `INSERT INTO contact.points (id, scope_kind, scope_id, channel, value, visibility, valid_from, valid_from_precision, valid_to, valid_to_precision, is_current, created_at, updated_at, version)
       SELECT m.point_id, 'organization.entities', i.entity_id,
              CASE s.code WHEN 'organization/identifier-scheme/contact-email' THEN 'email' ELSE 'phone' END::contact.points_channel_enum, i.value, 'restricted',
              i.valid_from, i.valid_from_precision::text::contact.points_valid_from_precision_enum, i.valid_to, i.valid_to_precision::text::contact.points_valid_to_precision_enum, i.is_current, i.created_at, now(), 1
         FROM organization.identifiers i JOIN contact_map m ON m.identifier_id = i.id JOIN reference.classifications s ON s.id = i.scheme_id`,
    );
    const [{ n: cAttr }] = await q(`WITH u AS (UPDATE source.attributions a SET target_kind = 'contact.points', target_id = m.point_id FROM contact_map m WHERE a.target_kind = 'organization.identifiers' AND a.target_id = m.identifier_id RETURNING 1) SELECT count(*)::int AS n FROM u`);
    const [{ n: cVer }] = await q(`WITH u AS (UPDATE source.verifications v SET target_kind = 'contact.points', target_id = m.point_id FROM contact_map m WHERE v.target_kind = 'organization.identifiers' AND v.target_id = m.identifier_id RETURNING 1) SELECT count(*)::int AS n FROM u`);
    await q(`DELETE FROM organization.identifiers i USING contact_map m WHERE i.id = m.identifier_id`);

    // Verification: nothing lost.
    const [{ n: places }] = await q(`SELECT count(*)::int AS n FROM place.places p JOIN loc_map m ON m.place_id = p.id`);
    const [{ n: occupancies }] = await q(`SELECT count(*)::int AS n FROM place.occupancies o JOIN loc_map m ON m.occupancy_id = o.id AND o.role_id IS NOT NULL`);
    const [{ n: points }] = await q(`SELECT count(*)::int AS n FROM contact.points p JOIN contact_map m ON m.point_id = p.id`);
    const [{ n: orphanAttr }] = await q(`SELECT count(*)::int AS n FROM source.attributions WHERE target_kind = 'organization.locations'`);
    const [{ n: orphanVer }] = await q(`SELECT count(*)::int AS n FROM source.verifications WHERE target_kind = 'organization.locations'`);
    const [{ n: leftover }] = await q(`SELECT count(*)::int AS n FROM organization.identifiers i JOIN reference.classifications s ON s.id = i.scheme_id WHERE s.code LIKE 'organization/identifier-scheme/contact-%'`);
    const problems = [
      places !== locationsBefore && `places ${places} != locations ${locationsBefore}`,
      occupancies !== locationsBefore && `occupancies ${occupancies} != locations ${locationsBefore}`,
      points !== contactBefore && `contact points ${points} != contact identifiers ${contactBefore}`,
      attrCopied !== attrMoved && `attribution copies ${attrCopied} != moved ${attrMoved}`,
      verCopied !== verMoved && `verification copies ${verCopied} != moved ${verMoved}`,
      orphanAttr + orphanVer > 0 && `${orphanAttr} attributions and ${orphanVer} verifications still point at locations`,
      leftover > 0 && `${leftover} contact identifiers remain`,
    ].filter(Boolean);
    if (problems.length) throw new Error(`location migration verification failed: ${problems.join("; ")}`);
    await runner.commitTransaction();
    return { locationsBefore, places, occupancies, contactIdentifiersBefore: contactBefore, contactPoints: points, attributionsMovedToPlaces: attrMoved, attributionsCopiedToOccupancies: attrCopied, verificationsMovedToPlaces: verMoved, verificationsCopiedToOccupancies: verCopied, contactAttributionsMoved: cAttr, contactVerificationsMoved: cVer };
  } catch (error) {
    await runner.rollbackTransaction();
    throw error;
  } finally {
    await runner.release();
  }
}
