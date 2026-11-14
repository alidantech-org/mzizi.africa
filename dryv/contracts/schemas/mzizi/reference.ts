/**
 * Schema: reference | Database: mzizi
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/reference.md
 * Review: accepted foundation inventory.
 * Countries are canonical modern-country identities; spatial units belong to Geography.
 * No fictional world country or mandatory country membership is implied.
 * Rules the pack lowers from storage constraints: no-overlap windows, acyclic chains, same-scheme supersession.
 * Removed by owner order (see .docs/decisions/DEC-REFERENCE-REMOVE-PATTERN-LEGAL-20261113.md): pattern versions, bindings and
 * dependencies, legal basis links and their Geography and Official bridges.
 * Not yet enforced: cycles through an edge table such as value_relations.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";

import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const reference = dryv
  .group({ name: "reference" })
  .description("Shared country identities, controlled meanings, measurement units and reviewed patterns.")
  .facets({ storage: { namespace: "reference", store: "main" } });

/*---------------- Reference schema contracts ----------------*/

export const Country = reference
  .schema("Country", {
    name: dryv.field(sharedProperties.Name),
  })
  .extends(baseSchemas.CodedEntity)
  .description("Canonical identity for a modern country; not a geographic unit or historical polity.")
  .role("entity")
  .facets({
    storage: dryv.storage("countries").index("name"),
  });

/** Country identity is independent of whether another record has a country relationship. */
/** The Geography link to a country is declared on geography.units.country_id, not here. */

export const Scheme = reference
  .schema("Scheme", {
    title: dryv.field(sharedProperties.Name),
    ownerSnapshot: dryv.field(sharedProperties.NonEmptyString255),
  })
  .extends(baseSchemas.CodedEntity)
  .description("Stable identity and stewardship snapshot for a controlled vocabulary scheme.")
  .role("entity")
  .facets({
    storage: dryv.storage("schemes"),
  });

export const Value = reference
  .schema("Value", {
    schemeId: belongsTo(Scheme),
    label: dryv.field(sharedProperties.Name),
    supersedesId: belongsTo(dryv.self).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("ValueDoesNotSupersedeItself", (v) => v.id.ne(v.supersedesId))
  .description("A controlled classification member within one scheme, with optional supersession.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("values")
      .sameAs("SupersessionStaysInScheme", { field: "supersedesId", match: ["schemeId"] })
      .acyclic("SupersessionAcyclic", { field: "supersedesId" })
      .index("schemeId")
      .index("supersedesId"),
  });

const unitProperties = reference.properties({
  /** Fixed precision so conversions are exact and reproducible, unlike a floating-point number. */
  Factor: dryv.property.number.decimal({ precision: 38, scale: 18 }),
});

export const Unit = reference
  .schema("Unit", {
    symbol: dryv.field(sharedProperties.NonEmptyString100),
    quantity: dryv.field(sharedProperties.NonEmptyString255),
    /** Exact conversion factor to the base unit: base = value * scale + offset. */
    scale: dryv.field(unitProperties.Factor),
    offset: dryv.field(unitProperties.Factor),
    baseId: belongsTo(dryv.self).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("UnitScaleMustBePositive", (v) => v.scale.gt(0))
  .description("Measurement unit and conversion to its optional base unit; never a spatial unit.")
  .role("entity")
  .facets({
    storage: dryv.storage("units").acyclic("BaseUnitAcyclic", { field: "baseId" }).index("baseId"),
  });

export const Topic = reference
  .schema("Topic", {
    label: dryv.field(sharedProperties.Name),
    parentId: belongsTo(dryv.self).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("TopicDoesNotParentItself", (v) => v.id.ne(v.parentId))
  .description("Cross-domain discovery topic hierarchy; topics do not own domain records.")
  .role("entity")
  .facets({
    storage: dryv.storage("topics").acyclic("TopicParentAcyclic", { field: "parentId" }).index("parentId"),
  });

export const Pattern = reference
  .schema("Pattern", {
    title: dryv.field(sharedProperties.Name),
  })
  .extends(baseSchemas.CodedEntity)
  .description("Stable identity for a reusable, reviewed pattern definition.")
  .role("entity")
  .facets({
    storage: dryv.storage("patterns"),
  });

export const referenceProposalEnums = reference.properties({
  ValueRelationKind: dryv.property.enum(["broader_than", "narrower_than", "related_to"]),
});

export const ValueRelation = reference
  .schema("ValueRelation", {
    sourceValueId: belongsTo(Value),
    targetValueId: belongsTo(Value),
    relationKind: dryv.field(referenceProposalEnums.ValueRelationKind),
    validFrom: dryv.field(sharedProperties.CalendarDate).maybe(),
    validUntil: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.Association)
  .rule("ValueRelationMustNotBeSelfReferential", (v) => v.sourceValueId.ne(v.targetValueId))
  .rule("ValueRelationWindowMustBeOrdered", rule.ordered("validFrom", "validUntil"))
  .description(
    "Proposed directed, typed, time-aware relation between classification values; supports multi-parent and cross-scheme taxonomy.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("value_relations")
      .index("sourceValueId", "relationKind", "validFrom")
      .index("targetValueId", "relationKind"),
  });
