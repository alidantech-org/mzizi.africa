/**
 * Schema: vocabulary | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md sections 4 and 22.4 (approved 2026-11-25).
 * Contract authors: vocabulary internals (shape, answers, status, label kind, mapping kind) are enums, so the vocabulary
 * never depends on itself. Descriptions below become SQL comments.
 */
import * as dryv from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { belongsTo, identityProperties, registerLinkTargets } from "./_links.ts";
import { Identities } from "./identity.ts";
import { Countries, Languages, Units } from "./reference.ts";

export const vocabulary = dryv
  .group({ name: "vocabulary" })
  .description(
    "Every controlled meaning: schemes (controlled lists), the identity kinds they classify, terms, their labels in every language and mappings between terms.",
  )
  .facets({ storage: { namespace: "vocabulary", store: "main" } });

const vocabularyProperties = vocabulary.properties({
  SchemeShape: dryv.property.enum({ Flat: "flat", Tree: "tree", Graph: "graph" }),
  SchemeAnswers: dryv.property.enum({ One: "one", Many: "many" }),
  TermStatus: dryv.property.enum({ Active: "active", Deprecated: "deprecated", Retired: "retired" }),
  LabelKind: dryv.property.enum({
    Preferred: "preferred",
    Plural: "plural",
    Short: "short",
    Abbreviation: "abbreviation",
    Alternative: "alternative",
    Definition: "definition",
  }),
  MappingKind: dryv.property.enum({
    Broader: "broader",
    Narrower: "narrower",
    Exact: "exact",
    Close: "close",
    Related: "related",
  }),
  IconCode: dryv.property.string().length({ min: 1, max: 100 }),
  ColorToken: dryv.property.string().length({ min: 1, max: 100 }),
});

/*---------------- vocabulary.schemes ----------------*/
export const Schemes = vocabulary
  .schema("Schemes", {
    shape: dryv
      .field(vocabularyProperties.SchemeShape)
      .description("How the scheme's terms are arranged: a flat list, a tree (parents) or a graph (mappings)."),
    answers: dryv
      .field(vocabularyProperties.SchemeAnswers)
      .description("Whether a thing takes one live answer per period from this scheme, or many."),
    isDated: dryv
      .field(sharedProperties.Flag)
      .description("True when classifications from this scheme carry a valid period."),
    isOpen: dryv
      .field(sharedProperties.Flag)
      .description("True when new terms may be added freely (tags); false for a closed, reviewed list."),
    countryId: belongsTo(() => Countries)
      .maybe()
      .description("Set only for a genuinely local scheme (a national budget classification); empty for a global scheme."),
    stewardId: belongsTo(() => Identities)
      .maybe()
      .description("The organisation that maintains the scheme (a statistics office, the UN); empty for Mzizi's own."),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "A controlled list such as feature kind, institution arm, topic, sex or age group. Its words are `vocabulary.labels`; it holds no display text.",
  )
  .role("entity")
  .facets({ storage: dryv.storage("schemes").index("countryId").index("stewardId") });

/*---------------- vocabulary.scopes ----------------*/
export const Scopes = vocabulary
  .schema("Scopes", {
    schemeId: belongsTo(() => Schemes, { onDelete: "cascade" }),
    identityKind: dryv
      .field(identityProperties.IdentityKind)
      .description("A kind of identity this scheme may classify; checked by Mzizi's code on `identity.classifications`."),
  })
  .extends(baseSchemas.Association)
  .description("Which kinds of named thing a scheme may classify.")
  .role("entity")
  .facets({ storage: dryv.storage("scopes").unique("schemeId", "identityKind") });

/*---------------- vocabulary.terms ----------------*/
export const Terms = vocabulary
  .schema("Terms", {
    schemeId: belongsTo(() => Schemes).description("The scheme this term belongs to."),
    parentId: belongsTo(dryv.self)
      .maybe()
      .description("The broader term in a tree-shaped scheme (water body above lake); its ancestors are its categories."),
    supersedesId: belongsTo(dryv.self)
      .maybe()
      .description("The older term this one replaces when a meaning changes; labels have no dates, terms carry history."),
    status: dryv.field(vocabularyProperties.TermStatus).description("Life of the term: active, deprecated or retired."),
    position: dryv
      .field(sharedProperties.NonNegativeInteger)
      .maybe()
      .description("Display order among siblings; empty sorts by label."),
    iconCode: dryv
      .field(vocabularyProperties.IconCode)
      .maybe()
      .description("Display hint: icon code for legends and chips."),
    colorToken: dryv
      .field(vocabularyProperties.ColorToken)
      .maybe()
      .description("Display hint: theme colour token for legends and chips."),
    countryId: belongsTo(() => Countries)
      .maybe()
      .description("Set only for a genuinely local term (Nyumba Kumi); terms are global by default."),
    lower: dryv
      .field(sharedProperties.Number)
      .maybe()
      .description("Lower bound of a numeric band (age 0–4 starts at 0), in `unit_id`."),
    upper: dryv
      .field(sharedProperties.Number)
      .maybe()
      .description("Upper bound of a numeric band; empty for an open band (age 65+)."),
    unitId: belongsTo(() => Units)
      .maybe()
      .description("Unit of `lower` and `upper` (year, person, metre)."),
    lowerInclusive: dryv.field(sharedProperties.Flag).maybe().description("True when `lower` belongs to the band."),
    upperInclusive: dryv.field(sharedProperties.Flag).maybe().description("True when `upper` belongs to the band."),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("TermIsNotItsOwnParent", (v) => v.parentId.ne(v.id))
  .rule("BandHasUnit", (v) => v.lower.isNull().and(v.upper.isNull()).or(v.unitId.isNotNull()))
  .rule("BandIsOrdered", (v) => v.lower.isNull().or(v.upper.isNull(), v.lower.lte(v.upper)))
  .description(
    "A member of one scheme: a code, its place in the scheme, display hints and optional numeric band. No display text: words are `vocabulary.labels`.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("terms")
      .index("schemeId", "position")
      .index("parentId")
      .index("supersedesId")
      .index("countryId")
      .acyclic("TermParentsHaveNoCycle", { field: "parentId" })
      .sameAs("ParentInSameScheme", { field: "parentId", match: ["schemeId"] }),
  });

registerLinkTargets({ terms: Terms });

/*---------------- vocabulary.labels ----------------*/
export const Labels = vocabulary
  .schema("Labels", {
    termId: belongsTo(() => Terms, { onDelete: "cascade" })
      .maybe()
      .description("The term this label words; exactly one of `term_id` and `scheme_id` is set."),
    schemeId: belongsTo(() => Schemes, { onDelete: "cascade" })
      .maybe()
      .description("The scheme this label words (its title or definition)."),
    languageId: belongsTo(() => Languages).description("Language of the text; never assumed to be English."),
    kind: dryv
      .field(vocabularyProperties.LabelKind)
      .description("What the text is for: preferred, plural, short, abbreviation, alternative or definition."),
    text: dryv.field(sharedProperties.NonEmptyString1000),
    countryId: belongsTo(() => Countries)
      .maybe()
      .description("Set when the same language words the term differently in one country."),
  })
  .extends(baseSchemas.Entity)
  .rule("LabelsOneOwner", dryv.rule.exactlyOne("termId", "schemeId"))
  .description(
    "Every word for a term or scheme, per language and optional country. Labels have no dates; a changed meaning is a new term.",
  )
  .role("entity");

const preferredTermLabel = vocabulary.expression(
  "PreferredTermLabel",
  Labels.check((v) => v.kind.eq("preferred").and(v.termId.isNotNull(), v.deletedAt.isNull())),
);
Labels.facets({
  storage: dryv
    .storage("labels")
    .indexes({
      description: "At most one preferred label per term, language and country.",
      fields: ["termId", "languageId", "countryId"],
      unique: true,
      where: preferredTermLabel,
    })
    .index("termId", "languageId")
    .index("schemeId", "languageId")
    .index("languageId"),
});

/*---------------- vocabulary.mappings ----------------*/
export const Mappings = vocabulary
  .schema("Mappings", {
    fromId: belongsTo(() => Terms, { onDelete: "cascade" }).description("The term the link starts from."),
    toId: belongsTo(() => Terms, { onDelete: "cascade" }).description("The term it points at; may be in another scheme."),
    kind: dryv
      .field(vocabularyProperties.MappingKind)
      .description("broader, narrower, exact, close or related (SKOS mapping kinds)."),
  })
  .extends(baseSchemas.Association)
  .rule("MappingIsNotItself", (v) => v.fromId.ne(v.toId))
  .description(
    "Links between terms across schemes and countries. Loops in broader and narrower links are refused by Mzizi's write code.",
  )
  .role("entity")
  .facets({ storage: dryv.storage("mappings").unique("fromId", "toId", "kind").index("toId") });
