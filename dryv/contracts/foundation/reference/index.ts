import * as dryv from "@dryvcode/author";

import { readSurface } from "../shared/read-surface.ts";
import { historicalEntitySchemas, sharedProperties } from "../shared/index.ts";

/**
 * Jurisdictions and jurisdiction-scoped vocabulary.
 *
 * A jurisdiction is a record: modern states and historical polities are the same kind of thing and
 * may overlap or change over time. Levels, institution types, election types, selection methods and
 * fiscal stages are ClassificationRecord rows scoped by jurisdiction and period, never enums or
 * columns.
 */
export const reference = dryv.group({ name: "reference" }).description("Jurisdictions and jurisdiction-scoped classification records.")
  .facets({ storage: { namespace: "reference" } });

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
    .extends(historicalEntitySchemas.HistoricalEntity)
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
      /** For a geography level: whether units of this level are expected to have a flag or an emblem (has, none, unknown). */
      flagExpected: dryv.field(sharedProperties.MediaMarker).optional().nullable(),
      emblemExpected: dryv.field(sharedProperties.MediaMarker).optional().nullable(),
    })
    .role("entity")
    .extends(historicalEntitySchemas.HistoricalEntity)
    .facets({
      storage: dryv.storage("classifications").indexes(
        { name: "idx_classification_scheme_code", fields: ["jurisdictionId", "scheme", "code"], unique: true },
      ),
    }),
});

/* Reads: clients discover jurisdictions and the vocabularies (levels, institution types, election types ...) here. */

const referenceRead = reference.feature("ReferenceRead").description("Public read access to jurisdictions and classification records.").tags("public");

const jurisdictions = readSurface(reference, {
  singular: "Jurisdiction", plural: "Jurisdictions", itemKey: "jurisdiction", listKey: "jurisdictions",
  path: "/reference/jurisdictions", idParam: "jurisdictionId", entity: referenceSchemas.Jurisdiction, description: "jurisdictions",
  filters: { kind: dryv.field(referenceProperties.JurisdictionKind).optional(), q: dryv.field(sharedProperties.Name).optional() },
});
const classifications = readSurface(reference, {
  singular: "ClassificationRecord", plural: "ClassificationRecords", itemKey: "record", listKey: "records",
  path: "/reference/classification-records", idParam: "recordId", entity: referenceSchemas.ClassificationRecord, description: "classification records",
  filters: {
    jurisdictionId: dryv.field(sharedProperties.Id).optional(),
    scheme: dryv.field(referenceProperties.ClassificationScheme).optional(),
    code: dryv.field(sharedProperties.BusinessCode).optional(),
  },
});

export const referenceReadOperations = referenceRead.operations({ ...jurisdictions.operations, ...classifications.operations });
