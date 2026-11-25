/**
 * Module `reference`: countries, languages, locales, currencies, units, timezones, and how countries divide themselves.
 * Raw rows with all names; the `frontend` module localizes them.
 */
import * as dryv from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import {
  Countries,
  Currencies,
  Hierarchies,
  Languages,
  Levels,
  Locales,
  reference,
  Units,
} from "#/schemas/postgres/reference.ts";
import { apiHttp, CACHE, identityRef, MAX_PAGE, namesOf, PageWindow } from "./_shared.ts";

const countries = reference.feature("Countries").failureDefaults(apiHttp);
const languages = reference.feature("Languages").failureDefaults(apiHttp);
const divisions = reference.feature("Divisions").failureDefaults(apiHttp);
const measures = reference.feature("Measures").failureDefaults(apiHttp);

const country = Countries.asRef();
const currency = Currencies.asRef();
const language = Languages.asRef();
const locale = Locales.asRef();
const hierarchy = Hierarchies.asRef();
const level = Levels.asRef();
const unit = Units.asRef();

const CountryKey = reference.schema("CountryKey", { code: dryv.field(p.IdentityCode) }).asRef();
const CountryScope = reference
  .schema("CountryScope", { countryId: dryv.field(p.Id) })
  .extends(PageWindow)
  .asRef();
const ListWindow = reference.schema("ReferenceWindow", {}).extends(PageWindow).asRef();

const q = {
  ...countries.queries({
    ScanCountries: dryv.readQuery
      .from(country)
      .input(ListWindow)
      .select((row) => ({
        countryId: row.fields.id,
        code: row.fields.code,
        isoAlpha2: row.fields.isoAlpha2,
        isoAlpha3: row.fields.isoAlpha3,
        callingCode: row.fields.callingCode,
        currencyCode: row.follow(country.fields.currencyId, currency).fields.isoCode,
        names: namesOf(row.follow(country.fields.id, identityRef)),
      }))
      .orderBy((row) => [row.fields.code.order("asc"), row.fields.id.order("asc")])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
    FindCountry: dryv.readQuery
      .from(country)
      .input(CountryKey)
      .where((row, args) => [row.fields.code.eq(args.code)])
      .select((row) => ({
        countryId: row.fields.id,
        code: row.fields.code,
        isoAlpha2: row.fields.isoAlpha2,
        isoAlpha3: row.fields.isoAlpha3,
        isoNumeric: row.fields.isoNumeric,
        callingCode: row.fields.callingCode,
        establishedOn: row.fields.establishedOn,
        currencyId: row.fields.currencyId,
        recognitionTerm: row.fields.recognitionTerm,
        designationTerm: row.fields.designationTerm,
        names: namesOf(row.follow(country.fields.id, identityRef)),
        locales: row.reverse(locale.fields.countryId, locale).select(
          (l) => ({
            languageId: l.fields.languageId,
            languageCode: l.follow(locale.fields.languageId, language).fields.code,
            languageIso: l.follow(locale.fields.languageId, language).fields.iso6391,
            statusTerm: l.fields.statusTerm,
            position: l.fields.position,
            fromYear: l.fields.fromYear,
            toYear: l.fields.toYear,
          }),
          (l) => [l.fields.position.order("asc"), l.fields.id.order("asc")],
        ),
      }))
      .orderBy((row) => [row.fields.id.order("asc")])
      .zeroOrOne(),
  }),
  ...languages.queries({
    ScanLanguages: dryv.readQuery
      .from(language)
      .input(ListWindow)
      .select((row) => ({
        languageId: row.fields.id,
        code: row.fields.code,
        iso6391: row.fields.iso6391,
        iso6393: row.fields.iso6393,
        directionTerm: row.fields.directionTerm,
        names: namesOf(row.follow(language.fields.id, identityRef)),
      }))
      .orderBy((row) => [row.fields.code.order("asc"), row.fields.id.order("asc")])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
  }),
  ...divisions.queries({
    ScanHierarchies: dryv.readQuery
      .from(hierarchy)
      .input(CountryScope)
      .where((row, args) => [row.fields.countryId.eq(args.countryId)])
      .select((row) => ({
        hierarchyId: row.fields.id,
        code: row.fields.code,
        kindTerm: row.fields.kindTerm,
        isRouting: row.fields.isRouting,
        fromYear: row.fields.fromYear,
        toYear: row.fields.toYear,
        names: namesOf(row.follow(hierarchy.fields.id, identityRef)),
        levels: row.reverse(level.fields.hierarchyId, level).select(
          (l) => ({
            levelId: l.fields.id,
            code: l.fields.code,
            depth: l.fields.depth,
            kindTerm: l.fields.kindTerm,
            names: namesOf(l.follow(level.fields.id, identityRef)),
          }),
          (l) => [l.fields.depth.order("asc"), l.fields.id.order("asc")],
        ),
      }))
      .orderBy((row) => [row.fields.fromYear.order("asc"), row.fields.code.order("asc"), row.fields.id.order("asc")])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
  }),
  ...measures.queries({
    ScanUnits: dryv.readQuery
      .from(unit)
      .input(ListWindow)
      .select((row) => ({
        unitId: row.fields.id,
        code: row.fields.code,
        symbol: row.fields.symbol,
        quantityTerm: row.fields.quantityTerm,
        baseId: row.fields.baseId,
        names: namesOf(row.follow(unit.fields.id, identityRef)),
      }))
      .orderBy((row) => [row.fields.code.order("asc"), row.fields.id.order("asc")])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
    ScanCurrencies: dryv.readQuery
      .from(currency)
      .input(ListWindow)
      .select((row) => ({
        currencyId: row.fields.id,
        code: row.fields.code,
        isoCode: row.fields.isoCode,
        minorUnits: row.fields.minorUnits,
        symbol: row.fields.symbol,
        names: namesOf(row.follow(currency.fields.id, identityRef)),
      }))
      .orderBy((row) => [row.fields.code.order("asc"), row.fields.id.order("asc")])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
  }),
};

export const referenceQueries = q;

const rows = reference.schemas({
  CountryEntry: dryv.schema.fromQuery(q.ScanCountries),
  CountryDetail: dryv.schema.fromQuery(q.FindCountry),
  LanguageEntry: dryv.schema.fromQuery(q.ScanLanguages),
  HierarchyEntry: dryv.schema.fromQuery(q.ScanHierarchies),
  UnitEntry: dryv.schema.fromQuery(q.ScanUnits),
  CurrencyEntry: dryv.schema.fromQuery(q.ScanCurrencies),
});
export const referenceRows = rows;
const io = reference.schemas({
  CountryCollection: dryv.schema({ countries: dryv.field(rows.CountryEntry).array() }),
  LanguageCollection: dryv.schema({ languages: dryv.field(rows.LanguageEntry).array() }),
  HierarchyCollection: dryv.schema({ hierarchies: dryv.field(rows.HierarchyEntry).array() }),
  UnitCollection: dryv.schema({ units: dryv.field(rows.UnitEntry).array() }),
  CurrencyCollection: dryv.schema({ currencies: dryv.field(rows.CurrencyEntry).array() }),
});

export const referenceOperations = {
  ...countries.operations({
    ListCountries: dryv
      .operation()
      .role("list")
      .description("Countries with their ISO codes, calling code, currency and all names.")
      .input(ListWindow)
      .output(io.CountryCollection)
      .queryFromInput(q.ScanCountries, { envelope: { countries: "rows" } })
      .cache(CACHE.reference)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/reference/countries").input(input, dryv.queryObject()).output(output),
      })),
    GetCountry: dryv
      .operation()
      .role("detail")
      .description("One country by code, with its locales in fallback order.")
      .input(CountryKey)
      .output(rows.CountryDetail)
      .queryFromInput(q.FindCountry, { missing: f.NotFound })
      .cache(CACHE.reference)
      .facets(({ inputField, output }) => ({
        http: dryv.http("GET", "/v1/reference/countries/{code}").input(inputField("code"), dryv.path()).output(output),
      })),
  }),
  ...languages.operations({
    ListLanguages: dryv
      .operation()
      .role("list")
      .description("Languages with their ISO codes, direction and names.")
      .input(ListWindow)
      .output(io.LanguageCollection)
      .queryFromInput(q.ScanLanguages, { envelope: { languages: "rows" } })
      .cache(CACHE.reference)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/reference/languages").input(input, dryv.queryObject()).output(output),
      })),
  }),
  ...divisions.operations({
    ListHierarchies: dryv
      .operation()
      .role("list")
      .description("How one country divides itself: its hierarchies over time, each with its levels in depth order.")
      .input(CountryScope)
      .output(io.HierarchyCollection)
      .queryFromInput(q.ScanHierarchies, { envelope: { hierarchies: "rows" } })
      .cache(CACHE.reference)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/reference/hierarchies").input(input, dryv.queryObject()).output(output),
      })),
  }),
  ...measures.operations({
    ListUnits: dryv
      .operation()
      .role("list")
      .description("Units of measurement with their symbols and conversions.")
      .input(ListWindow)
      .output(io.UnitCollection)
      .queryFromInput(q.ScanUnits, { envelope: { units: "rows" } })
      .cache(CACHE.reference)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/reference/units").input(input, dryv.queryObject()).output(output),
      })),
    ListCurrencies: dryv
      .operation()
      .role("list")
      .description("Currencies with their ISO codes and minor units.")
      .input(ListWindow)
      .output(io.CurrencyCollection)
      .queryFromInput(q.ScanCurrencies, { envelope: { currencies: "rows" } })
      .cache(CACHE.reference)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/reference/currencies").input(input, dryv.queryObject()).output(output),
      })),
  }),
};
