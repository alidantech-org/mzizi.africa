/**
 * Schema: template | Database: mzizi
 * Design: .docs/design/data/TEMPLATES_AND_SLOTS.md; decisions: .docs/decisions/DEC-DB-RETHINK-ROOTS-UNITS-SLOTS-20261125.md.
 * Contract authors: a pattern is a named identity; a template is the recipe for one kind of root row; a line says which
 * other template runs for every root; texts and items hold the words and the fixed lists. Only root rows keep a template
 * reference (`_templates.ts`); everything a root creates is an effect and is traced through its foreign keys. Templates
 * generate structure only: never people, never invented names, never evidence (results, figures, prices).
 * This schema depends on reference, identity and vocabulary alone, so every other schema may import it.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { enums } from "#/schemas/_enums.ts";
import { periodFields, periodProperties } from "#/schemas/_periods.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { belongsTo, identityKindField, identityReference, term } from "./_links.ts";
import { Countries, Languages, Levels } from "./reference.ts";

export const template = dryv
  .group({ name: "template" })
  .description(
    "Patterns and templates: the reviewed recipes by which roots (areas, institutions, offices, terms, contests, rules, budgets) and their effects are generated before real data is found.",
  )
  .facets({ storage: { namespace: "template", store: "main" } });

export const templateProperties = template.properties({
  Product: dryv.property.enum({
    Area: "area",
    Institution: "institution",
    Position: "position",
    Office: "office",
    Term: "term",
    Holder: "holder",
    Premises: "premises",
    Contact: "contact",
    Domain: "domain",
    ElectionCycle: "election-cycle",
    Contest: "contest",
    EventRule: "event-rule",
    EventSchedule: "event-schedule",
    Budget: "budget",
    Fund: "fund",
  }),
  Scope: dryv.property.enum({
    Level: "level",
    Within: "within",
    List: "list",
    Single: "single",
  }),
  CountKind: dryv.property.enum({
    Exact: "exact",
    Minimum: "minimum",
    Maximum: "maximum",
    Range: "range",
  }),
  TextPurpose: dryv.property.enum({
    Code: "code",
    Name: "name",
    Domain: "domain",
    Contact: "contact",
  }),
  TextBody: dryv.property.string().length({ min: 1, max: 1000 }),
});

/*---------------- template.patterns ----------------*/
export const Patterns = template
  .schema("Patterns", {
    identityKind: identityKindField("pattern"),
    countryId: belongsTo(() => Countries)
      .maybe()
      .description("The country the pattern belongs to; empty means any country."),
    ...periodFields,
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("PatternKind", (v) => v.identityKind.eq("pattern"))
  .rule("PatternPeriodIsOrdered", rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .description(
    "A reviewed rule set about how one kind of body repeats (a county government, an election cycle). Its names are `identity.names`; its legal basis is `legal.effects` targeting this identity. `fromYear` is the year the pattern takes effect (2013 for counties).",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("patterns").index("countryId").references("PatternIsIdentity", identityReference),
  });

/*---------------- template.templates ----------------*/
export const Templates = template
  .schema("Templates", {
    identityKind: identityKindField("template"),
    patternId: belongsTo(() => Patterns, { onDelete: "cascade" }),
    confidence: dryv
      .field(sharedProperties.Confidence)
      .maybe()
      .description(
        "How far the template's expectation is trusted, 0 to 1. It is stated once here, never on the rows it creates.",
      ),
    reason: dryv
      .field(sharedProperties.NonEmptyString500)
      .maybe()
      .description(
        "Why the template expects its rows to exist (the law, convention or pattern behind it). Stated once here, never on the rows it creates.",
      ),
    product: dryv.field(templateProperties.Product).description("The kind of row this template creates."),
    scope: dryv
      .field(templateProperties.Scope)
      .description(
        "level: one per area at the level; within: one per area at the level inside the root's area; list: one per item; single: one per root.",
      ),
    fanOutLevelId: belongsTo(() => Levels)
      .maybe()
      .description("The level the template fans out over; set for the level and within scopes only."),
    countKind: dryv
      .field(templateProperties.CountKind)
      .description(
        "How the count is known: exact, a minimum, a maximum or a range. Slots are made for exact and minimum counts only.",
      ),
    countMin: dryv
      .field(sharedProperties.PositiveInteger)
      .maybe()
      .description("The exact count, the minimum or the lower bound."),
    countMax: dryv.field(sharedProperties.PositiveInteger).maybe().description("The maximum or the upper bound."),
    startYear: dryv
      .field(periodProperties.Year)
      .maybe()
      .description(
        "The first year this template produces; defaults to the pattern's `fromYear` (Kenya's first general election was 2013, later ones follow a five-year cycle from 2017).",
      ),
    sequence: dryv
      .field(sharedProperties.NonNegativeInteger)
      .default(0)
      .description("Order in which the root templates of a pattern run (cycles before offices and terms)."),
    repeatYears: dryv
      .field(sharedProperties.PositiveInteger)
      .maybe()
      .description(
        "Cadence in years for products that repeat (election cycles, terms); the first year is the pattern's `fromYear`.",
      ),
    entityKindTerm: term("ofc.entity.kind", "Organisation kind of an institution product (public body).").maybe(),
    kindTerm: term("gov.institution.kind", "Institution kind of the product.").maybe(),
    arm: dryv.field(enums.InstitutionArm).description("Arm of the product.").maybe(),
    classTerm: term("gov.institution.class", "Institution class of the product.").maybe(),
    roleTerm: term("gov.position.role", "Position role of the product.").maybe(),
    method: dryv.field(enums.SelectionMethod).description("Selection method of the product.").maybe(),
    basisTerm: term("gov.seat.basis", "Seat basis of the product.").maybe(),
    termKindTerm: term("gov.term.kind", "Term kind of the product (parliamentary term, mandate).").maybe(),
    electionKindTerm: term("ele.election.kind", "Election kind of the product (general).").maybe(),
    electionStatus: dryv
      .field(enums.ElectionStatus)
      .description("Status the generated election starts with (scheduled).")
      .maybe(),
    electionPastStatus: dryv
      .field(enums.ElectionStatus)
      .description("Status for a cycle whose year has passed (held).")
      .maybe(),
    contestKindTerm: term("ele.contest.kind", "Contest kind of the product (governor, member of parliament).").maybe(),
    contactVisibility: dryv
      .field(enums.ContactVisibility)
      .description("Visibility of the generated contact (public).")
      .maybe(),
    premisesKindTerm: term("ofc.premises.kind", "Premises kind of the product (headquarters, regional office).").maybe(),
    contactKind: dryv.field(enums.ContactKind).description("Contact kind of the product (email, website).").maybe(),
    seatCount: dryv.field(sharedProperties.PositiveInteger).maybe(),
    termYears: dryv.field(sharedProperties.PositiveInteger).maybe(),
    termLimit: dryv.field(sharedProperties.PositiveInteger).maybe(),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("TemplateKind", (v) => v.identityKind.eq("template"))
  .rule("FanOutNeedsLevel", (v) => v.scope.eq("single").or(v.scope.eq("list"), v.fanOutLevelId.isNotNull()))
  .rule("LevelOnlyForFanOut", (v) => v.scope.eq("level").or(v.scope.eq("within"), v.fanOutLevelId.isNull()))
  .rule("ExactCountNeedsNumber", (v) => v.countKind.ne("exact").or(v.countMin.isNotNull()))
  .rule("MinimumCountNeedsNumber", (v) => v.countKind.ne("minimum").or(v.countMin.isNotNull()))
  .rule("MaximumCountNeedsNumber", (v) => v.countKind.ne("maximum").or(v.countMax.isNotNull()))
  .rule("RangeCountNeedsBounds", (v) => v.countKind.ne("range").or(v.countMin.isNotNull().and(v.countMax.isNotNull())))
  .rule("CountBoundsAreOrdered", rule.ordered("countMin", "countMax", { allowEqual: true }))
  .rule("InstitutionAttributesNeedInstitution", (v) =>
    v.product.eq("institution").or(v.kindTerm.isNull().and(v.arm.isNull(), v.classTerm.isNull())),
  )
  .rule("PositionAttributesNeedSeat", (v) =>
    v.product
      .eq("position")
      .or(
        v.product.eq("office"),
        v.product.eq("term"),
        v.product.eq("holder"),
        v.roleTerm
          .isNull()
          .and(v.method.isNull(), v.basisTerm.isNull(), v.seatCount.isNull(), v.termYears.isNull(), v.termLimit.isNull()),
      ),
  )
  .rule("PremisesKindNeedsPremises", (v) => v.product.eq("premises").or(v.premisesKindTerm.isNull()))
  .rule("ContactKindNeedsContact", (v) => v.product.eq("contact").or(v.contactKind.isNull()))
  .rule("RepeatNeedsRepeatingProduct", (v) =>
    v.repeatYears.isNull().or(v.product.eq("election-cycle"), v.product.eq("term"), v.product.eq("event-schedule")),
  )
  .description(
    "The recipe for one kind of row: what it creates, over which places or items, how many, and with which attributes. Its names are `identity.names`; texts for codes, names, domains and contact values are `template.texts`.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("templates")
      .index("patternId")
      .index("fanOutLevelId")
      .index("product")
      .references("TemplateIsIdentity", identityReference),
  });

/*---------------- template.lines ----------------*/
export const Lines = template
  .schema("Lines", {
    templateId: belongsTo(() => Templates, { onDelete: "cascade" }).description("The template that runs first (the root)."),
    effectTemplateId: belongsTo(() => Templates).description("The template that runs for every row the first one creates."),
    position: dryv.field(sharedProperties.NonNegativeInteger).description("Order in which effects run for one root."),
  })
  .extends(baseSchemas.Entity)
  .rule("LineIsNotSelf", rule.differs("templateId", "effectTemplateId"))
  .description(
    "One effect line: when the first template creates a row, the second runs for it. This list is how a template records its effects; the effects themselves carry no template column.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("lines")
      .unique("templateId", "effectTemplateId")
      .unique("templateId", "position")
      .index("effectTemplateId"),
  });

/*---------------- template.texts ----------------*/
export const Texts = template
  .schema("Texts", {
    templateId: belongsTo(() => Templates, { onDelete: "cascade" }),
    purpose: dryv.field(templateProperties.TextPurpose).description("code, name, domain or contact value."),
    languageId: belongsTo(() => Languages)
      .maybe()
      .description("The language of a name; empty for codes, domains and contact values."),
    nameKind: dryv
      .field(enums.NameKind)
      .maybe()
      .description("Kind of the generated name (official, short); set for names only."),
    body: dryv
      .field(templateProperties.TextBody)
      .description(
        "Text with named tokens and a closed list of transforms, such as `{county|slug}` or `{county|compact}.go.ke`.",
      ),
  })
  .extends(baseSchemas.Entity)
  .rule("NameHasLanguage", (v) => v.purpose.ne("name").or(v.languageId.isNotNull()))
  .rule("NameHasKind", (v) => v.purpose.ne("name").or(v.nameKind.isNotNull()))
  .rule("OnlyNamesHaveLanguage", (v) => v.purpose.eq("name").or(v.languageId.isNull()))
  .description("A text template for a code, a name per language, a web domain or a contact value.")
  .role("entity");

Texts.facets({
  storage: dryv.storage("texts").indexes({
    description: "One text per template, purpose and language; a missing language counts as one value.",
    fields: ["templateId", "purpose", "languageId"],
    unique: true,
    nullsNotDistinct: true,
  }),
});

/*---------------- template.items ----------------*/
export const Items = template
  .schema("Items", {
    templateId: belongsTo(() => Templates, { onDelete: "cascade" }),
    position: dryv.field(sharedProperties.NonNegativeInteger),
    key: dryv.field(sharedProperties.NonEmptyString100).description("Short token used in the template's texts (`iebc`)."),
    name: dryv.field(sharedProperties.NonEmptyString255).description("The item's name in `language_id`."),
    languageId: belongsTo(() => Languages),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "One fixed list entry of a template with the list scope (the Article 250 commissions, the cabinet portfolios).",
  )
  .role("entity")
  .facets({ storage: dryv.storage("items").unique("templateId", "key").unique("templateId", "position") });
