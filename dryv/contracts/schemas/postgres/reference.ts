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
import { Features, Levels } from "./geography.ts";
import { Institutions, Offices, Positions } from "./governance.ts";
import { Contacts } from "./official.ts";
import { Citations, Domains } from "./source.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const reference = dryv
  .group({ name: "reference" })
  .description("Shared country identities, controlled meanings, measurement units and reviewed patterns.")
  .facets({ storage: { namespace: "reference", store: "main" } });

/*---------------- Reference schema contracts ----------------*/

export const countryProperties = reference.properties({
  /** ISO 3166-1 alpha-2, upper case: KE. */
  IsoAlpha2: dryv.property
    .string()
    .length({ exact: 2 })
    .pattern({ match: ["^[A-Z]{2}$"] }),
  /** ISO 3166-1 alpha-3, upper case: KEN. */
  IsoAlpha3: dryv.property
    .string()
    .length({ exact: 3 })
    .pattern({ match: ["^[A-Z]{3}$"] }),
  /** ISO 3166-1 numeric, three digits with leading zeros: 404. */
  IsoNumeric: dryv.property
    .string()
    .length({ exact: 3 })
    .pattern({ match: ["^[0-9]{3}$"] }),
  /** ITU country calling code with its plus sign: +254. A shared code such as +1 is the country's main code. */
  CallingCode: dryv.property
    .string()
    .length({ min: 2, max: 5 })
    .pattern({ match: ["^\\+[0-9]{1,4}$"] }),
});

/**
 * Canonical identity for a modern country.
 *
 * Every classification link is optional and points at `reference.values`, which points at `reference.schemes`; nothing
 * there points back at a country, so the link graph stays acyclic and a country can be loaded before its classifications
 * are complete. The scheme each link must belong to is checked when seed files are validated, from the seed manifest.
 */
export const Country = reference
  .schema("Country", {
    name: dryv.field(sharedProperties.Name),
    officialName: dryv.field(sharedProperties.Name).maybe(),
    /** Optional: some entities have no ISO 3166 code (Somaliland, Transnistria); `code` identifies them. */
    isoAlpha2: dryv.field(countryProperties.IsoAlpha2).maybe(),
    isoAlpha3: dryv.field(countryProperties.IsoAlpha3).maybe(),
    isoNumeric: dryv.field(countryProperties.IsoNumeric).maybe(),
    callingCode: dryv.field(countryProperties.CallingCode).maybe(),
    continentId: belongsTo(() => Value)
      .tags("scheme:ref.sch.geo.continent")
      .maybe(),
    subregionId: belongsTo(() => Value)
      .tags("scheme:ref.sch.geo.subregion")
      .maybe(),
    currencyId: belongsTo(() => Value)
      .tags("scheme:ref.sch.fin.currency")
      .maybe(),
    recognitionStatusId: belongsTo(() => Value)
      .tags("scheme:ref.sch.geo.recognition.status")
      .maybe(),
    designationId: belongsTo(() => Value)
      .tags("scheme:ref.sch.ref.country.designation")
      .maybe(),
    establishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    /** The language shown first for a visitor in this country when they have chosen none. */
    defaultLanguageId: belongsTo(() => Language).maybe(),
    /** The host label of the country's own domain (`ke` for ke.mzizi.africa). Absent until a country domain exists. */
    subdomain: dryv.field(sharedProperties.NonEmptyString100).maybe(),
    /** True when the country is served publicly; false while data is being prepared. */
    isServed: dryv.field(sharedProperties.Flag),
  })
  .extends(baseSchemas.CodedEntity)
  .description("Canonical identity for a modern country; not a geographic unit or historical polity.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("countries")
      .index("name")
      .unique("isoAlpha2")
      .index("continentId")
      .index("subregionId")
      .index("currencyId")
      .index("recognitionStatusId")
      .index("designationId"),
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
    /** The broader value in the same scheme (river under water body, water body under natural); a value has at most one. */
    parentId: belongsTo(dryv.self).maybe(),
    /** Display order among the values of the scheme (ascending); values without one sort after those with one, by label. */
    position: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    /** Display hint: the name of an icon from the shared brand set, so no screen keeps its own label-to-icon map. */
    iconCode: dryv.field(sharedProperties.NonEmptyString100).maybe(),
    /** Display hint: a theme colour token (never a raw colour), for status and category chips. */
    colorToken: dryv.field(sharedProperties.NonEmptyString100).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("ValueDoesNotSupersedeItself", (v) => v.id.ne(v.supersedesId))
  .rule("ValueDoesNotParentItself", (v) => v.id.ne(v.parentId))
  .description(
    "A controlled classification member within one scheme, with optional supersession and an optional broader parent value in the same scheme. Wider, cross-scheme or many-parent links use value relations.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("values")
      .sameAs("SupersessionStaysInScheme", {
        field: "supersedesId",
        match: ["schemeId"],
      })
      .sameAs("ParentStaysInScheme", { field: "parentId", match: ["schemeId"] })
      .acyclic("SupersessionAcyclic", { field: "supersedesId" })
      .acyclic("ParentAcyclic", { field: "parentId" })
      .index("schemeId")
      .index("supersedesId")
      .index("parentId"),
  });

const labelProperties = reference.properties({
  /** preferred, alternative, abbreviation or definition. */
  ValueLabelKind: dryv.property.enum(["preferred", "alternative", "abbreviation", "definition"]),
});

export const ValueLabel = reference
  .schema("ValueLabel", {
    valueId: belongsTo(Value),
    languageId: belongsTo(() => Language),
    label: dryv.field(sharedProperties.Name),
    labelKind: dryv.field(labelProperties.ValueLabelKind),
  })
  .extends(baseSchemas.Entity)
  .description(
    "A label of a value in one language and of one kind, so a value can be shown in English, Swahili and other languages, with alternative names, abbreviations and definitions. The value's own label is the default display text.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("value_labels")
      .unique("valueId", "languageId", "labelKind", "label")
      .index("valueId")
      .index("languageId"),
  });

const languageProperties = reference.properties({
  /** ISO 639-1, lower case: sw. Absent for languages that have none. */
  Iso6391: dryv.property
    .string()
    .length({ exact: 2 })
    .pattern({ match: ["^[a-z]{2}$"] }),
  /** ISO 639-2, lower case: swa. */
  Iso6392: dryv.property
    .string()
    .length({ exact: 3 })
    .pattern({ match: ["^[a-z]{3}$"] }),
  /** ISO 639-3, lower case: swh. Also the special codes und, mul and zxx. */
  Iso6393: dryv.property
    .string()
    .length({ exact: 3 })
    .pattern({ match: ["^[a-z]{3}$"] }),
  /** Glottolog identifier: four letters and four digits, swah1253. */
  Glottocode: dryv.property
    .string()
    .length({ exact: 8 })
    .pattern({ match: ["^[a-z]{4}[0-9]{4}$"] }),
  /** endonym (the language's own name for itself), exonym (another language's name for it), alternative or abbreviation. */
  LanguageNameKind: dryv.property.enum(["endonym", "exonym", "alternative", "abbreviation"]),
});

/**
 * The language registry. Every name, label and wording that is in a language points here; nothing stores a language as free text.
 * Row codes are `ref.lng.<name>` (ref.lng.sw). Three special rows say what a plain NULL cannot: `und` (no language asserted),
 * `mul` (one form shared by several languages, such as "Kenya") and `zxx` (no linguistic content). A missing language never
 * means English. Family, script, direction, status and kind are scheme values, so they carry labels in any language.
 */
export const Language = reference
  .schema("Language", {
    /** The English display name, for people reading data. Names in other languages are in `language_names`. */
    name: dryv.field(sharedProperties.Name),
    iso6391: dryv.field(languageProperties.Iso6391).maybe(),
    iso6392: dryv.field(languageProperties.Iso6392).maybe(),
    iso6393: dryv.field(languageProperties.Iso6393).maybe(),
    glottocode: dryv.field(languageProperties.Glottocode).maybe(),
    /** Scheme ref.language.kind: language, macrolanguage, variety, special. */
    kindId: belongsTo(() => Value).tags("scheme:ref.sch.ref.language.kind"),
    /** Scheme ref.language.family: Bantu, Nilotic, Cushitic, Germanic, and so on. */
    familyId: belongsTo(() => Value)
      .tags("scheme:ref.sch.ref.language.family")
      .maybe(),
    /** Scheme ref.script: the main writing system. */
    scriptId: belongsTo(() => Value)
      .tags("scheme:ref.sch.ref.script")
      .maybe(),
    /** Scheme ref.text.direction: left to right, right to left. */
    directionId: belongsTo(() => Value)
      .tags("scheme:ref.sch.ref.text.direction")
      .maybe(),
    /** Scheme ref.language.status: official, national, recognised, minority, extinct, and so on. */
    statusId: belongsTo(() => Value)
      .tags("scheme:ref.sch.ref.language.status")
      .maybe(),
    /** The macrolanguage a language belongs to, or the language a variety belongs to. */
    parentId: belongsTo(dryv.self).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("LanguageIsNotItsOwnParent", (v) => v.id.ne(v.parentId))
  .description(
    "A language, macrolanguage, variety or one of the special no-language codes, with its ISO 639 and Glottolog identifiers and its classification as scheme values.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("languages")
      .unique("iso6391")
      .unique("iso6393")
      .unique("glottocode")
      .acyclic("LanguageParentAcyclic", { field: "parentId" })
      .index("name")
      .index("kindId")
      .index("familyId")
      .index("scriptId")
      .index("parentId"),
  });

export const LanguageName = reference
  .schema("LanguageName", {
    languageId: belongsTo(Language),
    /** The language the name is written in. For an endonym it is the language itself. */
    inLanguageId: belongsTo(Language),
    name: dryv.field(sharedProperties.Name),
    nameKind: dryv.field(languageProperties.LanguageNameKind),
  })
  .extends(baseSchemas.Entity)
  .description("A name of a language written in a language, such as Kiswahili (endonym) and Swahili (exonym).")
  .role("entity")
  .facets({
    storage: dryv
      .storage("language_names")
      .unique("languageId", "inLanguageId", "nameKind", "name")
      .index("languageId")
      .index("inLanguageId"),
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
    /** Scheme gov.pattern.kind: institution set, position set, site set, calendar set. */
    kindId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.gov.pattern.kind"),
    /** Set when the pattern belongs to one country; empty means it can be applied to any country. */
    countryId: belongsTo(() => Country).maybe(),
    description: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "A reviewed rule for generating expected records (institutions, positions, offices, site candidates) before real ones are found. It holds no versions, bindings or dependencies; see DEC-PATTERNS-GENERATE-EXPECTED-DATA-20261119.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("patterns").index("kindId").index("countryId"),
  });

const patternProperties = reference.properties({
  /** What a template produces: one closed set, because each product is a different table. */
  TemplateProduct: dryv.property.enum({
    Institution: "institution",
    Position: "position",
    Office: "office",
    Domain: "domain",
    Contact: "contact",
    EventRule: "event-rule",
  }),
});

/*---------------- reference.templates ----------------*/
export const Template = reference
  .schema("Template", {
    patternId: belongsTo(() => Pattern),
    produces: dryv.field(patternProperties.TemplateProduct),
    /** The geography level the template fans out over (one product per unit of that level); empty means exactly one. */
    fanOutLevelId: belongsTo(() => Levels).maybe(),
    /** The template this one sits under (an assembly under a county government). */
    parentTemplateId: belongsTo(dryv.self).maybe(),
    /** Name with named tokens, for example a place name token; the tokens are normalisers defined in the seed term lists. */
    nameTemplate: dryv.field(sharedProperties.NonEmptyString500),
    /** Code with named tokens, built the same way as the name. */
    codeTemplate: dryv.field(sharedProperties.NonEmptyString500),
    /** Attributes carried by the product; only those that fit `produces` are set. */
    institutionKindId: belongsTo(() => Value).maybe(),
    armId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.gov.arm"),
    classId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.gov.institution.class"),
    roleId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.gov.position.role"),
    selectionMethodId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.gov.selection.method"),
    seatBasisId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.gov.seat.basis"),
    seatCount: dryv.field(sharedProperties.PositiveInteger).maybe(),
    termYears: dryv.field(sharedProperties.PositiveInteger).maybe(),
    termLimit: dryv.field(sharedProperties.PositiveInteger).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("PositionAttributesRequirePositionProduct", (v) =>
    v.produces
      .eq("position")
      .or(
        v.produces.eq("office"),
        v.roleId
          .isNull()
          .and(
            v.selectionMethodId.isNull(),
            v.seatBasisId.isNull(),
            v.seatCount.isNull(),
            v.termYears.isNull(),
            v.termLimit.isNull(),
          ),
      ),
  )
  .rule("InstitutionAttributesRequireInstitutionProduct", (v) =>
    v.produces.eq("institution").or(v.institutionKindId.isNull().and(v.armId.isNull(), v.classId.isNull())),
  )
  .description(
    "One thing a pattern produces, how many (one per unit of a level), how it is named and coded, and the attributes it carries. Templates generate structure only, never people.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("templates")
      .unique("patternId", "code")
      .index("patternId")
      .index("fanOutLevelId")
      .index("parentTemplateId")
      .index("sourceCitationId"),
  });

/*---------------- reference.instances ----------------*/
export const Instance = reference
  .schema("Instance", {
    templateId: belongsTo(() => Template),
    /** The unit the product was generated for; empty when the template does not fan out. */
    unitFeatureId: belongsTo(() => Features).maybe(),
    /** Exactly one of these names the generated record. */
    institutionId: belongsTo(() => Institutions).maybe(),
    positionId: belongsTo(() => Positions).maybe(),
    officeId: belongsTo(() => Offices).maybe(),
    domainId: belongsTo(() => Domains).maybe(),
    contactId: belongsTo(() => Contacts).maybe(),
    /** Scheme ref.evidence.status: expected, sourced, verified, not found, disputed. */
    statusId: belongsTo(() => Value).tags("scheme:ref.sch.ref.evidence.status"),
    generatedAt: dryv.field(sharedProperties.Instant),
    /** The evidence that moved the record out of "expected". */
    verifiedCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.Entity)
  .rule("HasExactlyOneProduct", rule.exactlyOne("institutionId", "positionId", "officeId", "domainId", "contactId"))
  .description(
    "The ledger of generated records: which template produced which institution, position, office, site or contact, for which unit, and whether it is still only expected or has been sourced or verified.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("instances")
      .unique("templateId", "unitFeatureId")
      .index("templateId")
      .index("unitFeatureId")
      .index("institutionId")
      .index("positionId")
      .index("officeId")
      .index("domainId")
      .index("contactId")
      .index("statusId")
      .index("verifiedCitationId"),
  });

export const referenceProposalEnums = reference.properties({
  ValueRelationKind: dryv.property.enum(["broader_than", "narrower_than", "related_to"]),
});

export const ValueRelation = reference
  .schema("ValueRelation", {
    sourceValueId: belongsTo(Value),
    targetValueId: belongsTo(Value),
    relationKind: dryv.field(referenceProposalEnums.ValueRelationKind),
  })
  .extends(baseSchemas.Association)
  .rule("ValueRelationMustNotBeSelfReferential", (v) => v.sourceValueId.ne(v.targetValueId))
  .description(
    "A directed, typed, relation between classification values; supports multi-parent and cross-scheme taxonomy, such as a regional label that maps to a broader global kind.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("value_relations")
      .unique("sourceValueId", "targetValueId", "relationKind")
      .index("sourceValueId", "relationKind")
      .index("targetValueId", "relationKind"),
  });

/*---------------- reference.copy ----------------*/
export const Copy = reference
  .schema("Copy", {
    /** The copy key authored in a contract (`web.home.title`): lowercase, dot-separated. */
    key: dryv.field(sharedProperties.IdentityCode),
    languageId: belongsTo(() => Language),
    /** Set when the wording differs for one country; absent for the language's general wording. */
    countryId: belongsTo(() => Country).maybe(),
    text: dryv.field(sharedProperties.NonEmptyString),
    /** True for wording written for the interface and not yet reviewed. */
    isDevelopmentText: dryv.field(sharedProperties.Flag),
  })
  .extends(baseSchemas.Entity)
  .description(
    "One interface or explanatory wording for one copy key in one language, optionally specific to a country. Screens declare keys; the words live here.",
  )
  .role("entity");

const generalCopy = reference.expression(
  "GeneralCopy",
  Copy.check((v) => v.countryId.isNull()),
);

Copy.facets({
  storage: dryv
    .storage("copy")
    .unique("key", "languageId", "countryId")
    .unique("key", "languageId")
    .where(generalCopy)
    .index("languageId")
    .index("countryId"),
});
