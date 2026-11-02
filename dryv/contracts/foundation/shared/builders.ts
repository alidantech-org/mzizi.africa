import * as dryv from "@dryvcode/author";

import { evidencedEntitySchemas, sharedProperties } from "./index.ts";

/**
 * Authoring helpers so every domain declares entities the same way: evidence, valid time and
 * record time come from the shared foundation, identifiers are uuids, and references between
 * records are plain ids unless the entity pack should generate a relation.
 *
 * The entity pack names a relation property after its target, so an entity may declare only one
 * relation per target schema (the contract audit enforces it); other references use plainId().
 */
export type IndexSpec = { name: string; fields: string[]; unique?: boolean };

/** A stored, claim-bearing entity: provenance, valid time, verification and record time. */
export function evidenced(fields: Record<string, any>, table: string, indexes: IndexSpec[] = []) {
  return dryv
    .schema(fields)
    .role("entity")
    .extends(evidencedEntitySchemas.EvidencedEntity)
    .facets({ storage: dryv.storage(table).indexes(...indexes) });
}

/** A generated many-to-one relation to another entity's id. */
export function relationTo(target: () => any) {
  return dryv
    .field(sharedProperties.Id)
    .query({ filter: ["equal"] })
    .relation({ target: target as () => dryv.SchemaFieldRef<unknown>, cardinality: dryv.relation.manyToOne() });
}

/** A reference by id without a generated relation. */
export function plainId() {
  return dryv.field(sharedProperties.Id).query({ filter: ["equal"] });
}

export function optionalId() {
  return dryv.field(sharedProperties.Id).optional().nullable().query({ filter: ["equal"] });
}

export const searchable = { filter: ["startsWith", "contains"], sort: true, search: true } as const;
