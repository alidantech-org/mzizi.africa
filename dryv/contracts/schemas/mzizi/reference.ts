import * as dryv from "@dryvcode/author";

import { baseEntitySchemas, sharedProperties } from "../_shared.ts";

/**
 * Global vocabulary (database: mzizi, schema: reference).
 *
 * Schemes own values; values carry per-language labels. Codes are unique within a scheme; retired
 * values are preserved, and a superseding value must belong to the same scheme (no self-reference,
 * no cycles — enforced by the database service, not expressible here). Identities are UUIDv7 and
 * codes follow the repository's business-code convention. Country applicability, legal foundations
 * and accepted civic-data publication are deferred.
 */
export const vocabulary = dryv
  .group({ name: "vocabulary" })
  .description("Global vocabulary schemes, values and value labels.")
  .facets({ storage: { namespace: "reference" } });

export const vocabularyProperties = vocabulary.properties({
  /** BCP 47 language tag such as en, sw or en-KE. */
  LanguageTag: dryv.property.string().length({ min: 2, max: 35 }),
  Label: dryv.property.string().length({ min: 1, max: 300 }),
  LabelKind: dryv.property.enum({
    preferred: "preferred",
    alternate: "alternate",
  }),
});

export const vocabularySchemas = vocabulary.schemas({
  Scheme: dryv
    .schema({
      code: dryv
        .field(sharedProperties.BusinessCode)
        .query({ filter: ["equal", "startsWith"], sort: true, search: true }),
      title: dryv
        .field(sharedProperties.Name)
        .query({ filter: ["contains"], sort: true, search: true }),
      description: dryv
        .field(sharedProperties.Description)
        .optional()
        .nullable(),
      /** Stewardship owner snapshot: free-text owner at creation, not a relation. */
      stewardshipOwner: dryv.field(sharedProperties.Name),
    })
    .role("entity")
    .extends(baseEntitySchemas.BaseEntity)
    .facets({
      storage: dryv
        .storage("schemes")
        .indexes({ name: "idx_scheme_code", fields: ["code"], unique: true }),
    }),

  Value: dryv
    .schema({
      schemeId: dryv
        .field(sharedProperties.Id)
        .query({ filter: ["equal"] })
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> =>
            vocabularySchemas.Scheme.field("id"),
          cardinality: dryv.relation.manyToOne(),
        }),
      code: dryv
        .field(sharedProperties.BusinessCode)
        .query({ filter: ["equal", "startsWith"], sort: true, search: true }),
      description: dryv
        .field(sharedProperties.Description)
        .optional()
        .nullable(),
      retiredAt: dryv
        .field(sharedProperties.DateTime)
        .optional()
        .nullable()
        .query({ filter: ["equal"] }),
      /** Superseding value in the same scheme; same-scheme, non-self, acyclic rules live in the database service. */
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

  ValueLabel: dryv
    .schema({
      valueId: dryv
        .field(sharedProperties.Id)
        .query({ filter: ["equal"] })
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> =>
            vocabularySchemas.Value.field("id"),
          cardinality: dryv.relation.manyToOne(),
        }),
      language: dryv
        .field(vocabularyProperties.LanguageTag)
        .query({ filter: ["equal"] }),
      label: dryv
        .field(vocabularyProperties.Label)
        .query({ filter: ["contains"], search: true }),
      /** At most one preferred label per value and language; the partial unique index is a generated-SQL concern. */
      kind: dryv
        .field(vocabularyProperties.LabelKind)
        .query({ filter: ["equal"] }),
    })
    .role("entity")
    .extends(baseEntitySchemas.BaseEntity)
    .facets({
      storage: dryv.storage("value_labels").indexes({
        name: "idx_value_label_language_kind",
        fields: ["valueId", "language", "kind"],
      }),
    }),
});
