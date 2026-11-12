/**
 * Schema: reference | Database: mzizi
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/reference.md
 * Scope: agreed. Detailed table contracts: pending individual review.
 * Inventory below records proposals, not approval or executable definitions.
 * Existing definitions, where present, remain drafts requiring reconciliation.
 * No new generation activation is authorized by this file.
 */

/*---------------- Candidate table inventory: review required ----------------*/

/** reference.schemes — Controlled vocabulary identity.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End reference.schemes ----------------*/

/** reference.values — Versioned classification members.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End reference.values ----------------*/

/** reference.units — Physical and statistical units.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End reference.units ----------------*/

/** reference.topics — Cross-domain discovery topics.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End reference.topics ----------------*/

/** reference.patterns — Pattern identity.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End reference.patterns ----------------*/

/** reference.pattern_versions — Immutable pattern release.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End reference.pattern_versions ----------------*/

/** reference.pattern_bindings — Approved applicability.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End reference.pattern_bindings ----------------*/

/** reference.pattern_dependencies — Pinned release dependency.
 * Review fields, keys, relations, constraints and indexes in the linked design.
 */
/*---------------- End reference.pattern_dependencies ----------------*/

/** reference.legal_bases — Proposed Reference-owned Legal bridge; exact contract remains open. */
/*---------------- End reference.legal_bases ----------------*/

/*---------------- Existing draft definitions ----------------*/

import * as dryv from "@dryvcode/author";

import { baseEntitySchemas, sharedProperties } from "../_shared.ts";

/**
 * Global vocabulary (database: mzizi, schema: reference).
 *
 * Schemes own values; values carry per-language labels. Codes are unique within a scheme; retired
 * values are preserved, and a superseding value must belong to the same scheme (no self-reference,
 * no cycles — required behavior; enforcement is not implemented by this draft). Identities are UUIDv7 and
 * codes follow the repository's business-code convention. Country applicability, legal foundations
 * and accepted civic-data publication are deferred.
 */
export const vocabulary = dryv
  .group({ name: "vocabulary" })
  .description("Global vocabulary schemes, values and value labels.")
  .facets({ storage: { namespace: "reference" } });

export const vocabularyProperties = vocabulary.properties({
  LabelKind: dryv.property.enum({
    preferred: "preferred",
    alternate: "alternate",
  }),
});

export const vocabularySchemas = vocabulary.schemas({
  Scheme: dryv
    .schema({
      code: dryv.field(sharedProperties.BusinessCode).query({ filter: ["equal", "startsWith"], sort: true, search: true }),
      title: dryv.field(sharedProperties.Name).query({ filter: ["contains"], sort: true, search: true }),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
      /** Stewardship owner snapshot: free-text owner at creation, not a relation. */
      stewardshipOwner: dryv.field(sharedProperties.Name),
    })
    .role("entity")
    .extends(baseEntitySchemas.BaseEntity)
    .facets({
      storage: dryv.storage("schemes").indexes({ name: "idx_scheme_code", fields: ["code"], unique: true }),
    }),
  /*---------------- End table definition ----------------*/

  Value: dryv
    .schema({
      schemeId: dryv
        .field(sharedProperties.Id)
        .query({ filter: ["equal"] })
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => vocabularySchemas.Scheme.field("id"),
          cardinality: dryv.relation.manyToOne(),
        }),
      code: dryv.field(sharedProperties.BusinessCode).query({ filter: ["equal", "startsWith"], sort: true, search: true }),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
      retiredAt: dryv
        .field(sharedProperties.DateTime)
        .optional()
        .nullable()
        .query({ filter: ["equal"] }),
      /** Superseding value in the same scheme; same-scheme, non-self and acyclic constraints still require implementation. */
      supersededById: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .query({ filter: ["equal"] }),
    })
    .role("entity")
    .extends(baseEntitySchemas.BaseEntity)
    .facets({
      storage: dryv.storage("values").indexes({
        name: "idx_value_scheme_code",
        fields: ["schemeId", "code"],
        unique: true,
      }),
    }),
  /*---------------- End table definition ----------------*/

  ValueLabel: dryv
    .schema({
      valueId: dryv
        .field(sharedProperties.Id)
        .query({ filter: ["equal"] })
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => vocabularySchemas.Value.field("id"),
          cardinality: dryv.relation.manyToOne(),
        }),
      language: dryv.field(sharedProperties.LanguageTag).query({ filter: ["equal"] }),
      label: dryv.field(sharedProperties.Name).query({ filter: ["contains"], search: true }),
      /** At most one preferred label per value and language; the required partial unique index remains a generation gap. */
      kind: dryv.field(vocabularyProperties.LabelKind).query({ filter: ["equal"] }),
    })
    .role("entity")
    .extends(baseEntitySchemas.BaseEntity)
    .facets({
      storage: dryv.storage("value_labels").indexes({
        name: "idx_value_label_language_kind",
        fields: ["valueId", "language", "kind"],
      }),
    }),
  /*---------------- End table definition ----------------*/
});
