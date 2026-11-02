import type { GeographyEntityDto } from "#/modules/geography/dto/geography-entity.dto";

/**
 * Read-only SQL for the geography read slice. Written by hand: spatial and lateral-join queries are
 * outside what the generated entities express. Runs on the read-only database role.
 */
export type Row = Record<string, unknown>;

export const ENTITY_SQL = `
  SELECT u.id, u.code, u.name, c.label AS level, u.parent_id, p.name AS parent_name,
         u.valid_from, u.valid_to,
         b.version_number, b.source_name, b.source_reference, b.licence, b.reference_year,
         b.retrieved_at, b.verification_state
    FROM geo.units u
    JOIN reference.classifications c ON c.id = u.level_id
    JOIN reference.jurisdictions j ON j.id = u.jurisdiction_id
    LEFT JOIN geo.units p ON p.id = u.parent_id
    LEFT JOIN LATERAL (
      SELECT * FROM geo.boundaries v
       WHERE v.unit_id = u.id AND v.is_current = true
       ORDER BY v.version_number DESC LIMIT 1
    ) b ON true`;

export const CURRENT_VERIFIED_BOUNDARY_SQL = `
  SELECT * FROM geo.boundaries v
   WHERE v.unit_id = u.id AND v.is_current = true AND v.verification_state = 'verified'
   ORDER BY v.version_number DESC LIMIT 1`;

export function toEntity(row: Row): GeographyEntityDto {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    displayName: row.name,
    level: row.level,
    parentId: row.parent_id ?? null,
    parentName: row.parent_name ?? null,
    boundaryVerified: row.verification_state === "verified",
    boundarySource: row.source_name ?? null,
    boundarySourceReference: row.source_reference ?? null,
    boundaryLicense: row.licence ?? null,
    boundaryYear: row.reference_year ?? null,
    boundaryRetrievedAt: row.retrieved_at ?? null,
    boundaryVersion: row.version_number ?? null,
    validFrom: row.valid_from ?? null,
    validTo: row.valid_to ?? null,
  } as unknown as GeographyEntityDto;
}

export function toFeature(row: Row) {
  return {
    type: "Feature",
    geometry: JSON.parse(String(row.geometry)),
    properties: {
      geography_id: row.id,
      code: row.code,
      name: row.name,
      label_point: row.label_point ? JSON.parse(String(row.label_point)) : null,
    },
  };
}
