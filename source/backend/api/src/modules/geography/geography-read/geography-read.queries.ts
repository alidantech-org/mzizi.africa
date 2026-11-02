import type { GeographyEntityDto } from "#/modules/geography/dto/geography-entity.dto";

/**
 * Read-only SQL for the geography read slice. Written by hand: spatial and lateral-join queries are
 * outside what the generated entities express. Runs on the read-only database role.
 */
export type Row = Record<string, unknown>;

/**
 * Boundary provenance and verified state are not columns: they come from the source schema, which
 * points at the boundary row by (geography.boundaries, id). These joins are the only cross-schema
 * reads in the geography API (DATABASE_DESIGN.md).
 */
export const BOUNDARY_TARGET = "'geography.boundaries'";

export const ENTITY_SQL = `
  SELECT u.id, u.code, u.name, c.label AS level, u.parent_id, p.name AS parent_name,
         u.valid_from, u.valid_to,
         b.version_number, b.reference_year,
         bs.source_name, bs.source_reference, bs.licence, bs.retrieved_at,
         bv.state AS verification_state
    FROM geography.units u
    JOIN reference.classifications c ON c.id = u.level_id
    JOIN reference.jurisdictions j ON j.id = u.jurisdiction_id
    LEFT JOIN geography.units p ON p.id = u.parent_id
    LEFT JOIN LATERAL (
      SELECT * FROM geography.boundaries v
       WHERE v.unit_id = u.id AND v.is_current = true
       ORDER BY v.version_number DESC LIMIT 1
    ) b ON true
    LEFT JOIN LATERAL (
      SELECT ver.state FROM source.verifications ver
       WHERE ver.target_kind = ${BOUNDARY_TARGET} AND ver.target_id = b.id AND ver.is_current = true
       LIMIT 1
    ) bv ON true
    LEFT JOIN LATERAL (
      SELECT d.title AS source_name, d.citation AS source_reference, d.licence, cap.retrieved_at
        FROM source.attributions a
        JOIN source.documents d ON d.id = a.document_id
        LEFT JOIN source.captures cap ON cap.id = a.capture_id
       WHERE a.target_kind = ${BOUNDARY_TARGET} AND a.target_id = b.id AND a.relation = 'supports'
       ORDER BY a.created_at DESC LIMIT 1
    ) bs ON true`;

/** The current boundary of unit u whose verification is current and verified. */
export const CURRENT_VERIFIED_BOUNDARY_SQL = `
  SELECT v.* FROM geography.boundaries v
    JOIN source.verifications ver
      ON ver.target_kind = ${BOUNDARY_TARGET} AND ver.target_id = v.id AND ver.is_current = true AND ver.state = 'verified'
   WHERE v.unit_id = u.id AND v.is_current = true
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
