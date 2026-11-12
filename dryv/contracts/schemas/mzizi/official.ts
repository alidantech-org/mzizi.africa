/**
 * Schema: official | Database: mzizi
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/official.md
 * Scope: official.entities is authored as the minimum identity dependency required
 * by the authorized Source and Legal handoff. Remaining table inventory is proposal only.
 * No new generation activation is authorized by this file.
 */

import * as dryv from "@dryvcode/author";
import { sharedProperties } from "../_shared.ts";
import { referenceSchemas } from "./reference.ts";

export const official = dryv
  .group({ name: "official" })
  .description("Officially identified people and organizations.")
  .facets({ storage: { namespace: "official" } });

// biome-ignore lint/suspicious/noExplicitAny: target is registered immediately below.
export const officialSchemas: Record<string, any> = {};

/** Minimum integration identity; authority and officeholding belong to Governance. */
export const Entities = official.schemas({
  Entities: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      name: dryv.field(sharedProperties.Name),
      kind_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      registered_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      dissolved_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
    })
    .description("Stable organization identity; authority and officeholding belong to Governance.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("entities")
        .primaryKey("id")
        .indexes({ name: "uq_entities_code", fields: ["code"], unique: true }, { name: "idx_entities_kind", fields: ["kind_id"] }),
    }),
});
officialSchemas.Entities = Entities.Entities;
/*---------------- End official.entities ----------------*/

/*---------------- Candidate table inventory: review required ----------------*/

/** official.official_organization_identifiers — Issuer and scheme-specific identifier.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End official.official_organization_identifiers ----------------*/

/** official.ownerships — Organization control relationship.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End official.ownerships ----------------*/

/** official.person_ownerships — Individual ownership relationship.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End official.person_ownerships ----------------*/

/** official.official_organization_contacts — Organization-specific contact channels.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End official.official_organization_contacts ----------------*/

/** official.individuals — Canonical person identity.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End official.individuals ----------------*/

/** official.official_person_names — Attested names and forms.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End official.official_person_names ----------------*/

/** official.official_person_identifiers — Public external identifiers.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End official.official_person_identifiers ----------------*/

/** official.official_person_contacts — Public sourced contact channel.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End official.official_person_contacts ----------------*/

// The remaining candidate tables are not authored or composed until separately reviewed.
