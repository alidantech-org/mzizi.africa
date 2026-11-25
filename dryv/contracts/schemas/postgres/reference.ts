/**
 * Schema: reference | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md sections 6, 7.4, 14 and 21.2 (approved 2026-11-25).
 * Contract authors: reference holds true reference data only and depends on vocabulary and identity alone. Every table
 * here except `locales` is identity-backed: its names in every language are `identity.names`.
 */
import * as dryv from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { periodFields } from "#/schemas/_periods.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { belongsTo, identityKindField, identityReference, term } from "./_links.ts";

export const reference = dryv
  .group({ name: "reference" })
  .description(
    "True reference data: countries, languages, locales, currencies, units, timezones, and the hierarchies and levels by which countries divide themselves.",
  )
  .facets({ storage: { namespace: "reference", store: "main" } });

export const referenceProperties = reference.properties({
  IsoAlpha2: dryv.property
    .string()
    .length({ exact: 2 })
    .pattern({ match: ["^[A-Z]{2}$"] }),
  IsoAlpha3: dryv.property
    .string()
    .length({ exact: 3 })
    .pattern({ match: ["^[A-Z]{3}$"] }),
  IsoNumeric: dryv.property
    .string()
    .length({ exact: 3 })
    .pattern({ match: ["^[0-9]{3}$"] }),
  CallingCode: dryv.property
    .string()
    .length({ min: 2, max: 5 })
    .pattern({ match: ["^\\+[0-9]{1,4}$"] }),
  Iso6391: dryv.property
    .string()
    .length({ exact: 2 })
    .pattern({ match: ["^[a-z]{2}$"] }),
  Iso6393: dryv.property
    .string()
    .length({ exact: 3 })
    .pattern({ match: ["^[a-z]{3}$"] }),
  Glottocode: dryv.property
    .string()
    .length({ exact: 8 })
    .pattern({ match: ["^[a-z]{4}[0-9]{4}$"] }),
  CurrencyCode: dryv.property
    .string()
    .length({ exact: 3 })
    .pattern({ match: ["^[A-Z]{3}$"] }),
  MinorUnits: dryv.property.number.integer({ range: { min: 0, max: 6 } }),
  Factor: dryv.property.number.double(),
  IanaName: dryv.property
    .string()
    .length({ min: 3, max: 64 })
    .pattern({ match: ["^[A-Za-z_]+(/[A-Za-z0-9_+-]+)+$|^UTC$"] }),
  Depth: dryv.property.number.integer({ range: { min: 0, max: 12 } }),
});

/*---------------- reference.countries ----------------*/
export const Countries = reference
  .schema("Countries", {
    identityKind: identityKindField("country"),
    isoAlpha2: dryv
      .field(referenceProperties.IsoAlpha2)
      .maybe()
      .description("ISO 3166-1 alpha-2 (KE); empty for countries without one (Somaliland)."),
    isoAlpha3: dryv.field(referenceProperties.IsoAlpha3).maybe().description("ISO 3166-1 alpha-3 (KEN)."),
    isoNumeric: dryv.field(referenceProperties.IsoNumeric).maybe().description("ISO 3166-1 numeric (404)."),
    callingCode: dryv
      .field(referenceProperties.CallingCode)
      .maybe()
      .description("ITU calling code with its plus sign (+254)."),
    currencyId: belongsTo(() => Currencies)
      .maybe()
      .description("The currency in use."),
    recognitionTerm: term(
      "geo.recognition.status",
      "International recognition (UN member state, partially recognised).",
    ).maybe(),
    designationTerm: term("ref.country.designation", "How the country is designated (sovereign state, territory).").maybe(),
    establishedOn: dryv.field(sharedProperties.CalendarDate).maybe().description("Date the modern country was established."),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("CountryKind", (v) => v.identityKind.eq("country"))
  .description(
    "A modern country: facts only. Names are `identity.names`, regions are `identity.classifications`, its territory is the `geography.features` row sharing its identity.",
  )
  .role("entity");

Countries.facets({
  storage: dryv
    .storage("countries")
    .indexes(
      {
        description: "ISO alpha-2 is unique among live countries.",
        fields: ["isoAlpha2"],
        unique: true,
        where: reference.expression(
          "LiveCountry",
          Countries.check((v) => v.deletedAt.isNull()),
        ),
      },
      {
        description: "ISO alpha-3 is unique among live countries.",
        fields: ["isoAlpha3"],
        unique: true,
        where: reference.expression(
          "LiveCountryAlpha3",
          Countries.check((v) => v.deletedAt.isNull()),
        ),
      },
    )
    .index("currencyId")
    .references("CountryIsIdentity", identityReference),
});

/*---------------- reference.languages ----------------*/
export const Languages = reference
  .schema("Languages", {
    identityKind: identityKindField("language"),
    iso6391: dryv.field(referenceProperties.Iso6391).maybe().description("ISO 639-1 (sw)."),
    iso6392: dryv.field(referenceProperties.Iso6393).maybe().description("ISO 639-2 (swa)."),
    iso6393: dryv
      .field(referenceProperties.Iso6393)
      .maybe()
      .description("ISO 639-3 (swh), including the special codes und, mul and zxx."),
    glottocode: dryv.field(referenceProperties.Glottocode).maybe().description("Glottolog identifier (swah1253)."),
    kindTerm: term("ref.language.kind", "language, macrolanguage, variety or special."),
    familyTerm: term("ref.language.family", "Language family (Bantu, Nilotic, Cushitic).").maybe(),
    scriptTerm: term("ref.script", "Main writing system.").maybe(),
    directionTerm: term("ref.text.direction", "Text direction: left to right or right to left.").maybe(),
    vitalityTerm: term(
      "ref.language.vitality",
      "living, endangered or extinct; per-country status is in `locales`.",
    ).maybe(),
    parentId: belongsTo(dryv.self)
      .maybe()
      .description("The macrolanguage a language belongs to, or the language a variety belongs to."),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("LanguageKind", (v) => v.identityKind.eq("language"))
  .rule("LanguageIsNotItsOwnParent", (v) => v.id.ne(v.parentId))
  .description(
    "The language registry. Every text in the database points here; `und`, `mul` and `zxx` say what a missing language cannot, and a missing language never means English.",
  )
  .role("entity");

const liveLanguage = reference.expression(
  "LiveLanguage",
  Languages.check((v) => v.deletedAt.isNull()),
);
Languages.facets({
  storage: dryv
    .storage("languages")
    .indexes(
      { fields: ["iso6391"], unique: true, where: liveLanguage },
      { fields: ["iso6393"], unique: true, where: liveLanguage },
      { fields: ["glottocode"], unique: true, where: liveLanguage },
    )
    .index("parentId")
    .acyclic("LanguageParentsHaveNoCycle", { field: "parentId" })
    .references("LanguageIsIdentity", identityReference),
});

/*---------------- reference.locales ----------------*/
export const Locales = reference
  .schema("Locales", {
    countryId: belongsTo(() => Countries, { onDelete: "cascade" }),
    languageId: belongsTo(() => Languages),
    statusTerm: term("ref.locale.status", "official, national, recognised or regional."),
    position: dryv
      .field(sharedProperties.NonNegativeInteger)
      .description("Order of the language in the country's fallback chain and site menus (0 first)."),
    ...periodFields,
  })
  .extends(baseSchemas.CodedEntity)
  .rule("LocalePeriodIsOrdered", dryv.rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .description(
    "A language in a country (sw-KE, fr-CD) with its dated status. Drives the language fallback chain, the languages a site offers and number formatting.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("locales")
      .unique("countryId", "languageId", "fromYear")
      .index("languageId")
      .index("countryId", "position"),
  });

/*---------------- reference.currencies ----------------*/
export const Currencies = reference
  .schema("Currencies", {
    identityKind: identityKindField("currency"),
    isoCode: dryv.field(referenceProperties.CurrencyCode).maybe().description("ISO 4217 alphabetic code (KES)."),
    isoNumeric: dryv.field(referenceProperties.IsoNumeric).maybe().description("ISO 4217 numeric code (404)."),
    minorUnits: dryv
      .field(referenceProperties.MinorUnits)
      .description("Number of minor-unit digits (2 for cents); amounts are stored as whole minor units."),
    symbol: dryv.field(sharedProperties.NonEmptyString100).maybe().description("Display symbol (KSh)."),
    ...periodFields,
    replacedById: belongsTo(dryv.self).maybe().description("The currency that replaced this one when it ended."),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("CurrencyKind", (v) => v.identityKind.eq("currency"))
  .rule("CurrencyPeriodIsOrdered", dryv.rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .description("A currency with its ISO codes and minor units; currencies end and are replaced.")
  .role("entity");

Currencies.facets({
  storage: dryv
    .storage("currencies")
    .indexes({
      fields: ["isoCode"],
      unique: true,
      where: reference.expression(
        "LiveCurrentCurrency",
        Currencies.check((v) => v.deletedAt.isNull().and(v.toYear.isNull())),
      ),
    })
    .index("replacedById")
    .references("CurrencyIsIdentity", identityReference),
});

/*---------------- reference.units ----------------*/
export const Units = reference
  .schema("Units", {
    identityKind: identityKindField("unit"),
    symbol: dryv.field(sharedProperties.NonEmptyString100).description("Language-neutral symbol (km, kg, %)."),
    quantityTerm: term("ref.unit.quantity", "What the unit measures: length, mass, currency, count."),
    scale: dryv
      .field(referenceProperties.Factor)
      .description("Exact conversion to the base unit: base = value × scale + offset."),
    offset: dryv.field(referenceProperties.Factor).description("Offset of the conversion (non-zero for temperatures)."),
    baseId: belongsTo(dryv.self).maybe().description("The base unit this unit converts to; empty for a base unit."),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("UnitKind", (v) => v.identityKind.eq("unit"))
  .rule("UnitScaleIsPositive", (v) => v.scale.gt(0))
  .description("A unit of measurement and its exact conversion to a base unit; never a spatial unit.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("units")
      .index("baseId")
      .acyclic("BaseUnitsHaveNoCycle", { field: "baseId" })
      .references("UnitIsIdentity", identityReference),
  });

/*---------------- reference.timezones ----------------*/
export const Timezones = reference
  .schema("Timezones", {
    identityKind: identityKindField("timezone"),
    ianaName: dryv
      .field(referenceProperties.IanaName)
      .description("IANA time zone name (Africa/Nairobi); offsets come from the IANA rules, not from this row."),
    countryId: belongsTo(() => Countries)
      .maybe()
      .description("The country the zone belongs to; empty for UTC."),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("TimezoneKind", (v) => v.identityKind.eq("timezone"))
  .description("An IANA time zone.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("timezones")
      .unique("ianaName")
      .index("countryId")
      .references("TimezoneIsIdentity", identityReference),
  });

/*---------------- reference.hierarchies ----------------*/
export const Hierarchies = reference
  .schema("Hierarchies", {
    identityKind: identityKindField("hierarchy"),
    countryId: belongsTo(() => Countries).description("The country this hierarchy divides."),
    kindTerm: term("ref.hierarchy.kind", "administrative, electoral, traditional or statistical."),
    ...periodFields,
    isRouting: dryv
      .field(sharedProperties.Flag)
      .description(
        "True for the hierarchy addresses and breadcrumbs follow; at most one live routing hierarchy per country.",
      ),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("HierarchyKind", (v) => v.identityKind.eq("hierarchy"))
  .rule("HierarchyPeriodIsOrdered", dryv.rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .description(
    "One way a country divides itself for a period (Kenya administrative 1963–2013, Kenya administrative 2013–, Kenya electoral). Places are geography features linked through `geography.relationships`.",
  )
  .role("entity");

Hierarchies.facets({
  storage: dryv
    .storage("hierarchies")
    .indexes({
      description: "At most one live, current routing hierarchy per country.",
      fields: ["countryId"],
      unique: true,
      where: reference.expression(
        "CurrentRoutingHierarchy",
        Hierarchies.check((v) => v.isRouting.eq(true).and(v.toYear.isNull(), v.deletedAt.isNull())),
      ),
    })
    .index("countryId", "kindTerm")
    .references("HierarchyIsIdentity", identityReference),
});

/*---------------- reference.levels ----------------*/
export const Levels = reference
  .schema("Levels", {
    identityKind: identityKindField("level"),
    hierarchyId: belongsTo(() => Hierarchies, { onDelete: "cascade" }).description("The hierarchy this rank belongs to."),
    depth: dryv
      .field(referenceProperties.Depth)
      .description("Rank in the hierarchy (1 is the first division below the country), as ADM1–ADM4."),
    kindTerm: term("geo.level.kind", "The global word for the rank (county, province, district, ward)."),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("LevelKind", (v) => v.identityKind.eq("level"))
  .description("A rank of one hierarchy (Kenya 2013: county, sub-county, ward).")
  .role("entity")
  .facets({
    storage: dryv
      .storage("levels")
      .unique("hierarchyId", "depth")
      .index("kindTerm")
      .references("LevelIsIdentity", identityReference),
  });
