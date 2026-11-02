import * as dryv from "@dryvcode/author";

import { evidencedEntitySchemas, sharedProperties } from "../shared/index.ts";

/**
 * Jurisdictions and jurisdiction-scoped vocabulary.
 *
 * A jurisdiction is a record: modern states and historical polities are the same kind of thing and
 * may overlap or change over time. Levels, institution types, election types, selection methods and
 * fiscal stages are ClassificationRecord rows scoped by jurisdiction and period, never enums or
 * columns.
 */
export const reference = dryv.group({ name: "reference" }).description("Jurisdictions and jurisdiction-scoped classification records.");

export const referenceProperties = reference.properties({
  JurisdictionKind: dryv.property.enum({
    modernState: "modern_state",
    historicalPolity: "historical_polity",
    subnational: "subnational",
    supranational: "supranational",
  }),
  ClassificationScheme: dryv.property.string().length({ min: 2, max: 200 }),
  Label: dryv.property.string().length({ min: 1, max: 300 }),
  Order: dryv.property.number.integer({ range: { min: 0 } }),
});

export const referenceSchemas = reference.schemas({
  Jurisdiction: dryv
    .schema({
      code: dryv.field(sharedProperties.JurisdictionCode).query({ filter: ["equal", "startsWith"], sort: true, search: true }),
      name: dryv.field(sharedProperties.Name).query({ filter: ["startsWith", "contains"], sort: true, search: true }),
      kind: dryv.field(referenceProperties.JurisdictionKind).query({ filter: ["equal", "in"] }),
    })
    .role("entity")
    .extends(evidencedEntitySchemas.EvidencedEntity)
    .facets({
      storage: dryv.storage("jurisdictions").indexes({ name: "idx_jurisdiction_code", fields: ["code"], unique: true }),
    }),

  ClassificationRecord: dryv
    .schema({
      jurisdictionId: dryv
        .field(sharedProperties.Id)
        .query({ filter: ["equal"] })
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Jurisdiction.field("id"),
          cardinality: dryv.relation.manyToOne(),
        }),
      scheme: dryv.field(referenceProperties.ClassificationScheme).query({ filter: ["equal", "startsWith"], sort: true }),
      code: dryv.field(sharedProperties.BusinessCode).query({ filter: ["equal", "startsWith"], sort: true, search: true }),
      label: dryv.field(referenceProperties.Label).query({ filter: ["contains"], sort: true, search: true }),
      order: dryv.field(referenceProperties.Order).optional().nullable().query({ sort: true }),
      legalBasis: dryv.field(sharedProperties.Description).optional().nullable(),
    })
    .role("entity")
    .extends(evidencedEntitySchemas.EvidencedEntity)
    .facets({
      storage: dryv.storage("classification_records").indexes(
        { name: "idx_classification_scheme_code", fields: ["jurisdictionId", "scheme", "code"], unique: true },
      ),
    }),
});
