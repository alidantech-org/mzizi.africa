/**
 * Schema: legal | Database: mzizi
 * Contract implementation authorized by the Main/Operations handoff, 12 November 2026.
 * Stable instrument/provision identities and immutable source-backed wording versions.
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/legal.md
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { Features } from "./geography.ts";
import { Entities } from "./official.ts";
import { Language, Value } from "./reference.ts";
import { Citations, Documents, Evidence } from "./source.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const legal = dryv
  .group({ name: "legal" })
  .description("Legal instruments, exact wording versions and amendments.")
  .facets({ storage: { namespace: "legal", store: "main" } });

export const legalEnums = legal.properties({
  /** The level of a provision in an instrument's tree; one provision holds one statement. */
  ProvisionKind: dryv.property.enum([
    "preamble",
    "chapter",
    "part",
    "article",
    "clause",
    "paragraph",
    "subparagraph",
    "schedule",
    "item",
    "definition",
  ]),
  TranslationKind: dryv.property.enum([
    "official",
    "unofficial",
    "proposed-draft",
    "machine-proposed",
  ]),
  ReviewStatus: dryv.property.enum([
    "proposed",
    "reviewed",
    "accepted",
    "rejected",
  ]),
  ReferenceRelation: dryv.property.enum([
    "refers-to",
    "subject-to",
    "under",
    "in-accordance-with",
    "read-with",
    "as-defined-in",
    "repeals",
    "amends",
  ]),
  ReferenceMethod: dryv.property.enum(["parser", "model", "human"]),
  BasisRelation: dryv.property.enum([
    "established-by",
    "governed-by",
    "defined-by",
    "limited-by",
    "implements",
    "derives-from",
  ]),
});

export const Instruments = legal
  .schema("Instruments", {
    title: dryv.field(sharedProperties.Name),
    kindId: belongsTo(() => Value),
    issuingUnitId: belongsTo(() => Features),
    issuingEntityId: belongsTo(() => Entities).maybe(),
    enactedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    publishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "Stable instrument identity with explicit issuing territorial scope; geography alone never establishes applicability.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("instruments").index("kindId").index("issuingUnitId"),
  });

export const InstrumentVersions = legal
  .schema("InstrumentVersions", {
    instrumentId: belongsTo(() => Instruments),
    edition: dryv.field(sharedProperties.NonEmptyString255),
    /** The exact document (its sha256 and stored file) this release is read from. */
    documentId: belongsTo(() => Documents),
    evidenceId: belongsTo(() => Evidence).maybe(),
    consolidatedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    commencedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    ceasedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    repealedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    observedAt: dryv.field(sharedProperties.Instant),
    supersedesId: belongsTo(dryv.self).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "Exact source-backed release; observed, consolidated and legally effective dates have separate meanings.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("instrument_versions")
      .acyclic("InstrumentVersionSupersessionAcyclic", {
        field: "supersedesId",
      })
      .unique("instrumentId", "edition")
      .index("documentId")
      .index("evidenceId")
      .index("supersedesId"),
  });

export const Provisions = legal
  .schema("Provisions", {
    instrumentId: belongsTo(() => Instruments),
    parentId: belongsTo(dryv.self).maybe(),
    kind: dryv.field(legalEnums.ProvisionKind),
    designation: dryv.field(sharedProperties.NonEmptyString255),
    title: dryv.field(sharedProperties.Name).maybe(),
    /** Order among siblings, from 1; the designation alone does not sort (clause 10 comes after clause 9). */
    position: dryv.field(sharedProperties.PositiveInteger),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "Stable section identity within one instrument; hierarchy must remain within that instrument. One provision holds one statement: a numbered point is a row of its own under its parent.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("provisions")
      .sameAs("ParentInSameInstrument", {
        field: "parentId",
        match: ["instrumentId"],
      })
      .acyclic("ProvisionParentAcyclic", { field: "parentId" })
      .unique("parentId", "position")
      .index("instrumentId")
      .index("parentId"),
  });

export const ProvisionVersions = legal
  .schema("ProvisionVersions", {
    instrumentId: belongsTo(() => Instruments),
    provisionId: belongsTo(() => Provisions),
    instrumentVersionId: belongsTo(() => InstrumentVersions),
    citationId: belongsTo(() => Citations).maybe(),
    /** Original language of `text`. Never inferred from a default. */
    languageId: belongsTo(() => Language),
    /** Where in the source this wording was read: a page, a link or a locator, for a person to check. */
    locator: dryv.field(sharedProperties.NonEmptyString1000).maybe(),
    text: dryv.field(sharedProperties.NonEmptyString),
    effectiveFrom: dryv.field(sharedProperties.CalendarDate).maybe(),
    effectiveUntil: dryv.field(sharedProperties.CalendarDate).maybe(),
    observedAt: dryv.field(sharedProperties.Instant),
    supersedesId: belongsTo(dryv.self).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule(
    "EffectiveWindowIsOrdered",
    rule.ordered("effectiveFrom", "effectiveUntil"),
  )
  .description(
    "Immutable original wording in an exact instrument release; structured interpretation is separately reviewed.",
  )
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
      .noOverlap("NoOverlappingProvisionWording", {
        scope: ["provisionId"],
        from: "effectiveFrom",
        until: "effectiveUntil",
      })
      .unique("provisionId", "instrumentVersionId")
      .index("instrumentVersionId")
      .index("citationId")
      .index("supersedesId"),
  });

export const ProvisionTranslations = legal
  .schema("ProvisionTranslations", {
    provisionVersionId: belongsTo(() => ProvisionVersions),
    languageId: belongsTo(() => Language),
    text: dryv.field(sharedProperties.NonEmptyString),
    kind: dryv.field(legalEnums.TranslationKind),
    reviewStatus: dryv.field(legalEnums.ReviewStatus),
    /** The document the translation is read from, when it comes from one. */
    documentId: belongsTo(() => Documents).maybe(),
    /** Who or what produced it: a person, an organisation, or a model with its version; a snapshot. */
    producedBy: dryv.field(sharedProperties.JsonText).maybe(),
    reviewedBySnapshot: dryv.field(sharedProperties.JsonText).maybe(),
    reviewedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "The wording of one provision version in another language, one row per statement so translations line up row for row. A machine or unofficial translation is a reviewable proposal, never silently canonical.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("provision_translations")
      .unique("provisionVersionId", "languageId", "kind")
      .index("provisionVersionId")
      .index("languageId")
      .index("documentId"),
  });

export const ProvisionReferences = legal
  .schema("ProvisionReferences", {
    /** The wording that mentions another provision. */
    sourceVersionId: belongsTo(() => ProvisionVersions),
    /** Set when the mention is in a translation's text; the span then counts characters in that text. */
    translationId: belongsTo(() => ProvisionTranslations).maybe(),
    /** The provision mentioned; a link to its identity, so it follows the wording in force. */
    targetProvisionId: belongsTo(() => Provisions),
    relation: dryv.field(legalEnums.ReferenceRelation),
    /** The characters of the text that make the mention, counted from 0 as [start, end). */
    spanStart: dryv.field(sharedProperties.NonNegativeInteger),
    spanEnd: dryv.field(sharedProperties.PositiveInteger),
    spanText: dryv.field(sharedProperties.NonEmptyString500),
    method: dryv.field(legalEnums.ReferenceMethod),
    reviewStatus: dryv.field(legalEnums.ReviewStatus),
  })
  .extends(baseSchemas.Entity)
  .rule("SpanMustBeOrdered", rule.differs("spanStart", "spanEnd"))
  .description(
    "A mention of one provision inside the wording of another, with the exact span, so a reader can follow it like a link and ask what refers to a provision.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("provision_references")
      .unique("sourceVersionId", "translationId", "spanStart")
      .index("sourceVersionId")
      .index("translationId")
      .index("targetProvisionId"),
  });

export const Bases = legal
  .schema("Bases", {
    /** The table of the record that has a legal basis, such as reference.patterns or geography.features. */
    tableName: dryv.field(sharedProperties.NonEmptyString100),
    /** The record's identity path as seeded (its code, or its key parts joined by |); the loader derives recordId from it. */
    recordCode: dryv.field(sharedProperties.NonEmptyString500),
    recordId: dryv.field(sharedProperties.Id).maybe(),
    provisionId: belongsTo(() => Provisions),
    relation: dryv.field(legalEnums.BasisRelation),
    note: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.ValidityEntity)
  .description(
    "The one place that says which provision is the legal basis of a record in any table: a pattern, an institution, an office, a feature, a scheme or a value. The target varies by table, so it is a name and an id, not a foreign key.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("bases")
      .unique("tableName", "recordCode", "provisionId", "relation")
      .index("tableName", "recordId")
      .index("provisionId"),
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
  .description(
    "An exact authority provision changes an exact affected wording version; both historical texts remain available.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("amendments")
      .index("authorityId")
      .index("affectedId")
      .index("resultingVersionId")
      .index("kindId")
      .index("citationId"),
  });

/** Open: immutable wording and hashes.
 * Territorial scope uses geography.units.feature_id. No generic domain target pointer or automatic executable
 * legal interpretation is introduced. Reference owns incoming domain-to-Legal mediation.
 */
