/**
 * Schema: legal | Database: mzizi
 * Contract implementation authorized by the Main/Operations handoff, 12 November 2026.
 * Stable instrument/provision identities and immutable source-backed wording versions.
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/legal.md
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "../_base.ts";
import { sharedProperties } from "../_shared.ts";
import { FileVersions } from "./filesystem.ts";
import { Units } from "./geography.ts";
import { Entities } from "./official.ts";
import { Value } from "./reference.ts";
import { Citations, Evidence } from "./source.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const legal = dryv
  .group({ name: "legal" })
  .description("Legal instruments, exact wording versions and amendments.")
  .facets({ storage: { namespace: "legal", store: "main" } });

export const Instruments = legal
  .schema("Instruments", {
    title: dryv.field(sharedProperties.Name),
    kindId: belongsTo(() => Value),
    issuingUnitId: belongsTo(() => Units, { to: "featureId" }),
    issuingEntityId: belongsTo(() => Entities).maybe(),
    enactedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    publishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("Stable instrument identity with explicit issuing territorial scope; geography alone never establishes applicability.")
  .role("entity")
  .facets({
    storage: dryv.storage("instruments").index("kindId").index("issuingUnitId"),
  });

export const InstrumentVersions = legal
  .schema("InstrumentVersions", {
    instrumentId: belongsTo(() => Instruments),
    edition: dryv.field(sharedProperties.NonEmptyString255),
    fileVersionId: belongsTo(() => FileVersions),
    evidenceId: belongsTo(() => Evidence),
    contentHash: dryv.field(sharedProperties.Sha256),
    consolidatedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    commencedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    ceasedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    repealedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    observedAt: dryv.field(sharedProperties.Instant),
    supersedesId: belongsTo(dryv.self).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("Exact source-backed release; observed, consolidated and legally effective dates have separate meanings.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("instrument_versions")
      .acyclic("InstrumentVersionSupersessionAcyclic", { field: "supersedesId" })
      .unique("instrumentId", "edition")
      .index("fileVersionId")
      .index("evidenceId")
      .index("supersedesId"),
  });

export const Provisions = legal
  .schema("Provisions", {
    instrumentId: belongsTo(() => Instruments),
    parentId: belongsTo(dryv.self).maybe(),
    designation: dryv.field(sharedProperties.NonEmptyString255),
    title: dryv.field(sharedProperties.Name).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("Stable section identity within one instrument; hierarchy must remain within that instrument.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("provisions")
      .sameAs("ParentInSameInstrument", { field: "parentId", match: ["instrumentId"] })
      .acyclic("ProvisionParentAcyclic", { field: "parentId" })
      .index("instrumentId")
      .index("parentId"),
  });

export const ProvisionVersions = legal
  .schema("ProvisionVersions", {
    instrumentId: belongsTo(() => Instruments),
    provisionId: belongsTo(() => Provisions),
    instrumentVersionId: belongsTo(() => InstrumentVersions),
    citationId: belongsTo(() => Citations),
    text: dryv.field(sharedProperties.NonEmptyString),
    textHash: dryv.field(sharedProperties.Sha256),
    effectiveFrom: dryv.field(sharedProperties.CalendarDate).maybe(),
    effectiveUntil: dryv.field(sharedProperties.CalendarDate).maybe(),
    observedAt: dryv.field(sharedProperties.Instant),
    supersedesId: belongsTo(dryv.self).maybe(),
  })
  .extends(baseSchemas.Entity)
  .rule("EffectiveWindowIsOrdered", rule.ordered("effectiveFrom", "effectiveUntil"))
  .description("Immutable original wording in an exact instrument release; structured interpretation is separately reviewed.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("provision_versions")
      .references("ProvisionOfInstrument", {
        fields: ["provisionId", "instrumentId"],
        target: () => Provisions,
        targetFields: ["id", "instrumentId"],
      })
      .references("VersionOfInstrument", {
        fields: ["instrumentVersionId", "instrumentId"],
        target: () => InstrumentVersions,
        targetFields: ["id", "instrumentId"],
      })
      .acyclic("ProvisionVersionSupersessionAcyclic", { field: "supersedesId" })
      .noOverlap("NoOverlappingProvisionWording", { scope: ["provisionId"], from: "effectiveFrom", until: "effectiveUntil" })
      .unique("provisionId", "instrumentVersionId")
      .index("instrumentVersionId")
      .index("citationId")
      .index("supersedesId"),
  });

export const Amendments = legal
  .schema("Amendments", {
    authorityId: belongsTo(() => ProvisionVersions),
    affectedId: belongsTo(() => ProvisionVersions),
    resultingVersionId: belongsTo(() => ProvisionVersions).maybe(),
    kindId: belongsTo(() => Value),
    effectiveOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    explanation: dryv.field(sharedProperties.Description).maybe(),
    citationId: belongsTo(() => Citations),
  })
  .extends(baseSchemas.Entity)
  .description("An exact authority provision changes an exact affected wording version; both historical texts remain available.")
  .role("entity")
  .facets({
    storage: dryv.storage("amendments").index("authorityId").index("affectedId").index("resultingVersionId").index("kindId").index("citationId"),
  });

/** Open: immutable wording and hashes.
 * Territorial scope uses geography.units.feature_id. No generic domain target pointer or automatic executable
 * legal interpretation is introduced. Reference owns incoming domain-to-Legal mediation.
 */
