/**
 * Schema: legal | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md section 30.3 (approved 2026-11-25).
 * Contract authors: an official text in another language is a `wording`; `translations` are Mzizi's own unofficial
 * translations and never legal authority. Provenance and capture time are in `source.evidence`.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { enums } from "#/schemas/_enums.ts";
import { periodFields } from "#/schemas/_periods.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { belongsTo, identity, identityKindField, identityReference, term } from "./_links.ts";
import { Accounts } from "./auth.ts";
import { Jurisdictions } from "./governance.ts";
import { Languages } from "./reference.ts";

export const legal = dryv
  .group({ name: "legal" })
  .description(
    "The rules: legal instruments, editions, provisions, wordings, translations, references, relationships and effects.",
  )
  .facets({ storage: { namespace: "legal", store: "main" } });

export const legalEnums = legal.properties({
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
  TranslationMethod: dryv.property.enum(["human", "machine"]),
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
  Note: dryv.property.string().length({ min: 1, max: 4000 }),
  Heading: dryv.property.string().length({ min: 1, max: 1000 }),
});

const note = {
  note: dryv.field(legalEnums.Note).maybe().description("Optional explanation, written in `note_language_id`."),
  noteLanguageId: belongsTo(() => Languages).maybe(),
};

/*---------------- legal.instruments ----------------*/
export const Instruments = legal
  .schema("Instruments", {
    identityKind: identityKindField("instrument"),
    kindTerm: term("leg.instrument.kind", "constitution, act, regulation, by-law, treaty."),
    status: dryv.field(enums.InstrumentStatus).description("in force, repealed, pending.").maybe(),
    jurisdictionId: belongsTo(() => Jurisdictions)
      .maybe()
      .description("The authority and area under which it was made."),
    issuerId: identity("The body that issued it (Parliament, a county assembly).").maybe(),
    ...periodFields,
    enactedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    publishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("InstrumentKind", (v) => v.identityKind.eq("instrument"))
  .rule("InstrumentPeriodIsOrdered", rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .description("A legal instrument (the Constitution of Kenya 2010, an Act). Its titles are `identity.names`.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("instruments")
      .index("kindTerm")
      .index("issuerId")
      .index("jurisdictionId")
      .references("InstrumentIsIdentity", identityReference),
  });

/*---------------- legal.editions ----------------*/
export const Editions = legal
  .schema("Editions", {
    instrumentId: belongsTo(() => Instruments, { onDelete: "cascade" }),
    designation: dryv.field(sharedProperties.NonEmptyString255).description("The edition's label (Revised Edition 2022)."),
    consolidatedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    commencedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    ceasedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    repealedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    supersedesId: belongsTo(dryv.self).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One edition of an instrument with its consolidation and commencement dates.")
  .role("entity")
  .facets({ storage: dryv.storage("editions").unique("instrumentId", "designation").index("supersedesId") });

/*---------------- legal.provisions ----------------*/
export const Provisions = legal
  .schema("Provisions", {
    instrumentId: belongsTo(() => Instruments, { onDelete: "cascade" }),
    parentId: belongsTo(dryv.self).maybe().description("The enclosing provision (the chapter of an article)."),
    kind: dryv.field(legalEnums.ProvisionKind),
    designation: dryv.field(sharedProperties.NonEmptyString255).description("The provision's number or label (Article 1)."),
    position: dryv.field(sharedProperties.PositiveInteger).description("Order among siblings."),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("ProvisionIsNotItsOwnParent", rule.differs("id", "parentId"))
  .description("The tree of articles and sections of an instrument; headings are on `wordings`.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("provisions")
      .index("instrumentId", "parentId", "position")
      .acyclic("ProvisionParentsHaveNoCycle", { field: "parentId" })
      .sameAs("ParentInSameInstrument", { field: "parentId", match: ["instrumentId"] }),
  });

/*---------------- legal.wordings ----------------*/
export const Wordings = legal
  .schema("Wordings", {
    provisionId: belongsTo(() => Provisions, { onDelete: "cascade" }),
    editionId: belongsTo(() => Editions),
    languageId: belongsTo(() => Languages).description("Language of the official text."),
    heading: dryv.field(legalEnums.Heading).maybe(),
    text: dryv.field(sharedProperties.NonEmptyString),
    supersedesId: belongsTo(dryv.self).maybe(),
    startsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    endsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("WordingDatesAreOrdered", rule.ordered("startsOn", "endsOn", { allowEqual: true }))
  .description("The official text of a provision in one edition and language.")
  .role("entity")
  .facets({ storage: dryv.storage("wordings").unique("provisionId", "editionId", "languageId").index("editionId") });

/*---------------- legal.translations ----------------*/
export const Translations = legal
  .schema("Translations", {
    wordingId: belongsTo(() => Wordings, { onDelete: "cascade" }),
    languageId: belongsTo(() => Languages),
    text: dryv.field(sharedProperties.NonEmptyString),
    method: dryv.field(legalEnums.TranslationMethod).description("human or machine; authority is never implied."),
    review: dryv.field(legalEnums.ReviewStatus),
    reviewedById: belongsTo(() => Accounts).maybe(),
    reviewedAt: dryv.field(sharedProperties.Instant).maybe(),
    notes: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("Mzizi's own unofficial translation of a wording; never legal authority.")
  .role("entity")
  .facets({ storage: dryv.storage("translations").unique("wordingId", "languageId", "method").index("languageId") });

/*---------------- legal.references ----------------*/
export const References = legal
  .schema("References", {
    wordingId: belongsTo(() => Wordings, { onDelete: "cascade" }).maybe(),
    translationId: belongsTo(() => Translations, { onDelete: "cascade" }).maybe(),
    targetProvisionId: belongsTo(() => Provisions),
    targetWordingId: belongsTo(() => Wordings).maybe(),
    relation: dryv.field(legalEnums.ReferenceRelation),
    spanStart: dryv.field(sharedProperties.NonNegativeInteger).description("Character offset where the reference starts."),
    spanEnd: dryv.field(sharedProperties.PositiveInteger),
    spanText: dryv.field(sharedProperties.NonEmptyString500),
    method: dryv.field(legalEnums.ReferenceMethod),
    reviewStatus: dryv.field(legalEnums.ReviewStatus),
    metadata: dryv
      .field(sharedProperties.JsonText)
      .maybe()
      .description(
        "What the parser found beyond the one target: the whole citation group (`Article 10, (a) and (b)`), the instrument cited (this one, the Constitution or a named outside instrument), the designations and how far each resolved. Provenance and URLs belong in `source`, not here.",
      ),
  })
  .extends(baseSchemas.Entity)
  .rule("ReferenceHasOneSource", rule.exactlyOne("wordingId", "translationId"))
  .rule("ReferenceSpanIsOrdered", (v) => v.spanStart.lt(v.spanEnd))
  .description('A cross-reference found inside a text ("subject to Article 24").')
  .role("entity")
  .facets({ storage: dryv.storage("references").index("wordingId").index("translationId").index("targetProvisionId") });

/*---------------- legal.relationships ----------------*/
export const Relationships = legal
  .schema("Relationships", {
    kindTerm: term("leg.relationship.kind", "amends, repeals, replaces, commences."),
    authorityWordingId: belongsTo(() => Wordings)
      .maybe()
      .description("The text that makes the change."),
    affectedWordingId: belongsTo(() => Wordings).maybe(),
    resultingWordingId: belongsTo(() => Wordings).maybe(),
    subjectInstrumentId: belongsTo(() => Instruments).maybe(),
    objectInstrumentId: belongsTo(() => Instruments).maybe(),
    effectiveOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    ...note,
  })
  .extends(baseSchemas.CodedEntity)
  .rule("RelationshipNoteHasLanguage", (v) => v.note.isNull().or(v.noteLanguageId.isNotNull()))
  .description("An amendment, repeal or replacement between instruments or wordings.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("relationships")
      .index("subjectInstrumentId")
      .index("objectInstrumentId")
      .index("affectedWordingId"),
  });

/*---------------- legal.effects ----------------*/
export const Effects = legal
  .schema("Effects", {
    wordingId: belongsTo(() => Wordings, { onDelete: "cascade" }).description("The exact authority text."),
    identityId: identity("The named thing the provision acts on (an office, institution, place or law)."),
    kindTerm: term("leg.effect.kind", "establishes, authorizes, governs, limits, changes, abolishes."),
    reviewStatus: dryv.field(legalEnums.ReviewStatus),
    ...periodFields,
    effectiveOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    endedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    ...note,
  })
  .extends(baseSchemas.CodedEntity)
  .rule("EffectDatesAreOrdered", rule.ordered("effectiveOn", "endedOn", { allowEqual: true }))
  .rule("EffectNoteHasLanguage", (v) => v.note.isNull().or(v.noteLanguageId.isNotNull()))
  .description("What a provision does to a named thing; a reviewed assertion that never changes the thing itself.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("effects")
      .unique("wordingId", "identityId", "kindTerm", "fromYear")
      .index("identityId")
      .index("kindTerm"),
  });
