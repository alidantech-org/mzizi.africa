/**
 * Schema: legal | Database: mzizi
 * Contract implementation authorized by the Main/Operations handoff, 12 November 2026.
 * Nine tables: instruments, names, editions, provisions, wordings, translations, references, relationships, effects.
 * Design: .docs/design/data/LEGAL_SCHEMA.md
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { Features } from "./geography.ts";
import { Entities } from "./official.ts";
import { Language, Value } from "./reference.ts";
import { Citations } from "./source.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const legal = dryv
  .group({ name: "legal" })
  .description(
    "Legal instruments, their names, editions, provisions, authoritative wordings, translations, references, relationships and effects.",
  )
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
  /** How a translation was produced. Authority is never implied by the method or by review. */
  TranslationMethod: dryv.property.enum(["human", "machine", "assisted"]),
  ReviewStatus: dryv.property.enum(["proposed", "reviewed", "accepted", "rejected"]),
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
});

export const Instruments = legal
  .schema("Instruments", {
    /** Scheme leg.instrument.kind: constitution, act, bill, regulation, treaty. Not a lifecycle status. */
    kindId: belongsTo(() => Value),
    /** Scheme leg.instrument.status: introduced, withdrawn, enacted and so on. Absent while unassessed. */
    statusId: belongsTo(() => Value).maybe(),
    /** Territorial scope; absent when joint, international or unknown. Geography alone never establishes applicability. */
    issuingUnitId: belongsTo(() => Features).maybe(),
    issuingEntityId: belongsTo(() => Entities).maybe(),
    enactedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    publishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("Stable instrument identity, independent of its names, editions, downloads and languages.")
  .role("entity")
  .facets({
    storage: dryv.storage("instruments").index("kindId").index("statusId").index("issuingUnitId"),
  });

export const Names = legal
  .schema("Names", {
    instrumentId: belongsTo(() => Instruments),
    /** `und` when no language is asserted; never defaulted to English. */
    languageId: belongsTo(() => Language),
    name: dryv.field(sharedProperties.Name),
    /** Scheme leg.name.kind: formal title, short name, alternative, abbreviation, canonical. */
    kindId: belongsTo(() => Value),
    /** The name to show for this instrument and language while it applies; at most one current preferred name. */
    isPreferred: dryv.field(sharedProperties.Flag),
  })
  .extends(baseSchemas.CodedValidityEntity)
  .description(
    "A name of one instrument in one language, with its kind and validity. All forms resolve to the same instrument.",
  )
  .role("entity");

const preferredName = legal.expression(
  "PreferredCurrentName",
  Names.check((v) => v.isPreferred.eq(true).and(v.validUntil.isNull())),
);

Names.facets({
  storage: dryv
    .storage("names")
    .unique("instrumentId", "languageId", "kindId", "name")
    .unique("instrumentId", "languageId")
    .where(preferredName)
    .index("instrumentId")
    .index("languageId")
    .index("kindId"),
});

export const Editions = legal
  .schema("Editions", {
    instrumentId: belongsTo(() => Instruments),
    /** The legal content state's own label, such as a consolidation or commencement name. */
    designation: dryv.field(sharedProperties.NonEmptyString255),
    consolidatedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    commencedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    ceasedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    repealedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    observedAt: dryv.field(sharedProperties.Instant),
    supersedesId: belongsTo(dryv.self).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("EditionMustNotSupersedeItself", rule.differs("id", "supersedesId"))
  .description("A meaningful legal content state of an instrument. Not a download and not a Source publication edition.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("editions")
      .acyclic("EditionSupersessionAcyclic", { field: "supersedesId" })
      .unique("instrumentId", "designation")
      .unique("id", "instrumentId")
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
    "Stable provision identity within one instrument; hierarchy stays within that instrument. One provision holds one statement.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("provisions")
      .sameAs("ParentInSameInstrument", { field: "parentId", match: ["instrumentId"] })
      .acyclic("ProvisionParentAcyclic", { field: "parentId" })
      .unique("parentId", "position")
      .unique("id", "instrumentId")
      .index("instrumentId")
      .index("parentId"),
  });

export const Wordings = legal
  .schema("Wordings", {
    instrumentId: belongsTo(() => Instruments),
    provisionId: belongsTo(() => Provisions),
    editionId: belongsTo(() => Editions),
    citationId: belongsTo(() => Citations).maybe(),
    /** The language this authority-bearing text is written in. Never inferred from a default. */
    languageId: belongsTo(() => Language),
    text: dryv.field(sharedProperties.NonEmptyString),
    effectiveFrom: dryv.field(sharedProperties.CalendarDate).maybe(),
    effectiveUntil: dryv.field(sharedProperties.CalendarDate).maybe(),
    observedAt: dryv.field(sharedProperties.Instant),
    supersedesId: belongsTo(dryv.self).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("EffectiveWindowIsOrdered", rule.ordered("effectiveFrom", "effectiveUntil"))
  .description("Exact authority-bearing text of one provision in one edition and language. Translations are separate rows.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("wordings")
      .references("ProvisionOfInstrument", {
        fields: ["provisionId", "instrumentId"],
        target: () => Provisions,
        targetFields: ["id", "instrumentId"],
      })
      .references("EditionOfInstrument", {
        fields: ["editionId", "instrumentId"],
        target: () => Editions,
        targetFields: ["id", "instrumentId"],
      })
      .acyclic("WordingSupersessionAcyclic", { field: "supersedesId" })
      .unique("provisionId", "editionId", "languageId")
      .index("editionId")
      .index("languageId")
      .index("citationId")
      .index("supersedesId"),
  });

export const Translations = legal
  .schema("Translations", {
    /** The exact authoritative wording translated; a later wording never inherits this row. */
    wordingId: belongsTo(() => Wordings),
    languageId: belongsTo(() => Language),
    text: dryv.field(sharedProperties.NonEmptyString),
    method: dryv.field(legalEnums.TranslationMethod),
    /** Who or what produced it: a person, an organisation or a model with its version; a snapshot. */
    producedBy: dryv.field(sharedProperties.JsonText).maybe(),
    producedAt: dryv.field(sharedProperties.Instant).maybe(),
    reviewStatus: dryv.field(legalEnums.ReviewStatus),
    reviewedBySnapshot: dryv.field(sharedProperties.JsonText).maybe(),
    reviewedAt: dryv.field(sharedProperties.Instant).maybe(),
    notes: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "A translated representation of one exact wording. Several translations into one language are valid; review never makes a translation legal authority.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("translations").unique("id", "wordingId").index("wordingId").index("languageId"),
  });

export const References = legal
  .schema("References", {
    /** The wording that mentions another provision; exactly one of wording or translation. */
    wordingId: belongsTo(() => Wordings).maybe(),
    /** Set instead when the mention is in a translation's text; the span counts characters in that text. */
    translationId: belongsTo(() => Translations).maybe(),
    /** The provision mentioned. */
    targetProvisionId: belongsTo(() => Provisions),
    /** When the mention points at one historical text rather than whatever is in force. */
    targetWordingId: belongsTo(() => Wordings).maybe(),
    relation: dryv.field(legalEnums.ReferenceRelation),
    /** Characters of the text that make the mention, counted from 0 as [start, end) in Unicode code points. */
    spanStart: dryv.field(sharedProperties.NonNegativeInteger),
    spanEnd: dryv.field(sharedProperties.PositiveInteger),
    spanText: dryv.field(sharedProperties.NonEmptyString500),
    method: dryv.field(legalEnums.ReferenceMethod),
    reviewStatus: dryv.field(legalEnums.ReviewStatus),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("ExactlyOneOrigin", rule.exactlyOne("wordingId", "translationId"))
  .rule("SpanMustBeOrdered", rule.ordered("spanStart", "spanEnd"))
  .rule("SpanMustBeNonEmpty", rule.differs("spanStart", "spanEnd"))
  .description(
    "A textual mention of a provision inside a wording or translation, with the exact span. A mention is not an amendment.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("references")
      .unique("wordingId", "targetProvisionId", "spanStart")
      .unique("translationId", "targetProvisionId", "spanStart")
      .index("wordingId")
      .index("translationId")
      .index("targetProvisionId")
      .index("targetWordingId"),
  });

export const Relationships = legal
  .schema("Relationships", {
    /** Scheme leg.relationship.kind: amends, repeals, replaces, supplements, enacted-as, subject-to, made-under, implements, part-of. */
    kindId: belongsTo(() => Value),
    /** The wording that carries out the operation. */
    authorityWordingId: belongsTo(() => Wordings).maybe(),
    /** Text-level operation: the wording affected and, when text changes, the wording that results. */
    affectedWordingId: belongsTo(() => Wordings).maybe(),
    resultingWordingId: belongsTo(() => Wordings).maybe(),
    /** Instrument-level operation or hierarchy: subject is subject-to, made under or enacted as the object. */
    subjectInstrumentId: belongsTo(() => Instruments).maybe(),
    objectInstrumentId: belongsTo(() => Instruments).maybe(),
    effectiveOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    explanation: dryv.field(sharedProperties.Description).maybe(),
    citationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("ExactlyOneLevel", rule.exactlyOne("affectedWordingId", "subjectInstrumentId"))
  .rule("InstrumentEndsTogether", rule.allOrNone("subjectInstrumentId", "objectInstrumentId"))
  .rule("InstrumentsMustDiffer", rule.differs("subjectInstrumentId", "objectInstrumentId"))
  .rule("WordingMustNotAffectItself", rule.differs("affectedWordingId", "resultingWordingId"))
  .description(
    "A substantive legal operation or hierarchy link between wordings or instruments. Source derivation is not recorded here.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("relationships")
      .index("kindId")
      .index("authorityWordingId")
      .index("affectedWordingId")
      .index("resultingWordingId")
      .index("subjectInstrumentId")
      .index("objectInstrumentId")
      .index("citationId"),
  });

export const Effects = legal
  .schema("Effects", {
    /** The exact authority text. A translation is never legal authority, so this is a wording. */
    wordingId: belongsTo(() => Wordings),
    /** Scheme leg.effect.kind: establishes, authorizes, governs, limits, changes, abolishes. */
    kindId: belongsTo(() => Value),
    explanation: dryv.field(sharedProperties.Description).maybe(),
    reviewStatus: dryv.field(legalEnums.ReviewStatus),
    observedAt: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.CodedValiditySubjectEntity)
  .description(
    "A reviewed assertion of what a wording establishes, governs, limits or changes for one subject record. Never mutates the subject.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("effects")
      .unique("wordingId", "subjectTable", "subjectId", "kindId", "validFrom")
      .index("subjectTable", "subjectId")
      .index("kindId")
      .index("wordingId"),
  });
