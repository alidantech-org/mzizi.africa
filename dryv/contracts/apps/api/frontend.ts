/**
 * Module `frontend`: the one module that maps system data into clean, typed, frontend-ready shapes
 * (`.docs/rules/api-modules.md`). It owns no tables and no domain rules: its use cases read through the schema
 * modules' generated queries, choose every displayed text with the shared language chain (requested language, the
 * country's locales, `mul`, `en`, any) and return `LocalizedText`. One call per screen.
 */
import * as dryv from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { periodProperties } from "#/schemas/_periods.ts";
import { measureProperties } from "#/schemas/postgres/_measures.ts";
import { apiHttp, apiProperties, CACHE, LanguageChoice, sharedShapes } from "./_shared.ts";

export const frontend = dryv
  .group({ name: "frontend" })
  .description("Screen-shaped reads composed from the schema modules: localized texts, place summaries, trees and series.");

const screens = frontend.feature("Screens").failureDefaults(apiHttp);
const T = sharedShapes.LocalizedText;

const frontendProperties = frontend.properties({
  Host: dryv.property.string().length({ min: 1, max: 253 }),
  MessageKey: dryv.property.string().length({ min: 1, max: 255 }),
  MessageText: dryv.property.string().length({ min: 1, max: 8000 }),
  SearchText: dryv.property.string().length({ min: 1, max: 200 }),
});

/*---------------- inputs ----------------*/
const inputs = {
  Home: frontend
    .schema("HomeRequest", { host: dryv.field(frontendProperties.Host).optional() })
    .extends(LanguageChoice)
    .asRef(),
  Place: frontend
    .schema("PlaceRequest", { country: dryv.field(p.IdentityCode), place: dryv.field(p.IdentityCode).optional() })
    .extends(LanguageChoice)
    .asRef(),
  Search: frontend
    .schema("SearchRequest", {
      country: dryv.field(p.IdentityCode).optional(),
      text: dryv.field(frontendProperties.SearchText),
    })
    .extends(LanguageChoice)
    .asRef(),
  Institution: frontend
    .schema("InstitutionRequest", { country: dryv.field(p.IdentityCode), institution: dryv.field(p.IdentityCode) })
    .extends(LanguageChoice)
    .asRef(),
  Ranking: frontend
    .schema("RankingRequest", {
      country: dryv.field(p.IdentityCode),
      indicator: dryv.field(p.IdentityCode),
      year: dryv.field(periodProperties.Year).optional(),
    })
    .extends(LanguageChoice)
    .asRef(),
  Copy: frontend
    .schema("CopyRequest", { app: dryv.field(p.IdentityCode) })
    .extends(LanguageChoice)
    .asRef(),
};

/*---------------- shared screen parts ----------------*/
const parts = frontend.schemas({
  PlaceLink: dryv.schema({
    id: dryv.field(p.Id),
    code: dryv.field(p.IdentityCode),
    name: dryv.field(T),
    kind: dryv.field(T).optional().description("Label of the place's kind or level (County, Ward)."),
  }),
  Figure: dryv.schema({
    indicator: dryv.field(p.IdentityCode),
    label: dryv.field(T),
    value: dryv.field(p.Number).maybe(),
    lower: dryv.field(p.Number).maybe(),
    upper: dryv.field(p.Number).maybe(),
    unit: dryv.field(p.NonEmptyString100).maybe(),
    decimals: dryv.field(p.NonNegativeInteger).maybe(),
    fromYear: dryv.field(periodProperties.Year).maybe(),
    toYear: dryv.field(periodProperties.Year).maybe(),
    status: dryv.field(measureProperties.FigureStatus),
    basis: dryv.field(measureProperties.FigureBasis),
  }),
  Leader: dryv.schema({
    office: dryv.field(p.IdentityCode),
    officeName: dryv.field(T),
    person: dryv.field(p.IdentityCode).maybe(),
    personName: dryv.field(T).optional(),
    fromYear: dryv.field(periodProperties.Year).maybe(),
  }),
  ProjectLink: dryv.schema({
    code: dryv.field(p.IdentityCode),
    name: dryv.field(T),
    status: dryv.field(T).optional(),
  }),
  EventLink: dryv.schema({
    code: dryv.field(p.IdentityCode),
    name: dryv.field(T),
    startsOn: dryv.field(p.CalendarDate),
  }),
  ArticleLink: dryv.schema({ code: dryv.field(p.IdentityCode), title: dryv.field(T) }),
  LanguageOption: dryv.schema({
    code: dryv.field(p.IdentityCode),
    tag: dryv.field(apiProperties.LanguageCode),
    name: dryv.field(T),
    direction: dryv.field(apiProperties.TextDirection),
  }),
  CountryLink: dryv.schema({
    id: dryv.field(p.Id),
    code: dryv.field(p.IdentityCode),
    isoAlpha2: dryv.field(p.NonEmptyString100).maybe(),
    name: dryv.field(T),
  }),
  Message: dryv.schema({ key: dryv.field(frontendProperties.MessageKey), text: dryv.field(frontendProperties.MessageText) }),
  SearchHit: dryv.schema({
    code: dryv.field(p.IdentityCode),
    kind: dryv.field(p.NonEmptyString100),
    name: dryv.field(T),
    context: dryv.field(T).optional().description("Where the thing is (its parent place), for telling equal names apart."),
  }),
  RankRow: dryv.schema({
    place: dryv.field(p.IdentityCode),
    name: dryv.field(T),
    value: dryv.field(p.Number).maybe(),
    rank: dryv.field(p.PositiveInteger).maybe(),
    status: dryv.field(measureProperties.FigureStatus),
  }),
  OfficeRow: dryv.schema({
    office: dryv.field(p.IdentityCode),
    name: dryv.field(T),
    holder: dryv.field(T).optional(),
    holderCode: dryv.field(p.IdentityCode).maybe(),
    fromYear: dryv.field(periodProperties.Year).maybe(),
  }),
});

/*---------------- screens ----------------*/
const documents = frontend.schemas({
  HomeScreen: dryv.schema({
    language: dryv.field(apiProperties.LanguageCode),
    countries: dryv.field(parts.CountryLink).array(),
    languages: dryv.field(parts.LanguageOption).array(),
  }),
  PlaceScreen: dryv.schema({
    country: dryv.field(parts.CountryLink),
    place: dryv.field(parts.PlaceLink),
    language: dryv.field(apiProperties.LanguageCode),
    languages: dryv.field(parts.LanguageOption).array(),
    breadcrumb: dryv.field(parts.PlaceLink).array(),
    children: dryv.field(parts.PlaceLink).array(),
    figures: dryv.field(parts.Figure).array(),
    leaders: dryv.field(parts.Leader).array(),
    projects: dryv.field(parts.ProjectLink).array(),
    events: dryv.field(parts.EventLink).array(),
    articles: dryv.field(parts.ArticleLink).array(),
  }),
  SearchResults: dryv.schema({
    language: dryv.field(apiProperties.LanguageCode),
    hits: dryv.field(parts.SearchHit).array(),
  }),
  InstitutionScreen: dryv.schema({
    language: dryv.field(apiProperties.LanguageCode),
    code: dryv.field(p.IdentityCode),
    name: dryv.field(T),
    arm: dryv.field(T).optional(),
    offices: dryv.field(parts.OfficeRow).array(),
  }),
  RankingScreen: dryv.schema({
    language: dryv.field(apiProperties.LanguageCode),
    indicator: dryv.field(T),
    unit: dryv.field(p.NonEmptyString100).maybe(),
    year: dryv.field(periodProperties.Year).maybe(),
    rows: dryv.field(parts.RankRow).array(),
  }),
  CopyBundle: dryv.schema({ language: dryv.field(apiProperties.LanguageCode), messages: dryv.field(parts.Message).array() }),
});
export const frontendShapes = { ...parts, ...documents };

export const frontendOperations = screens.operations({
  GetHomeScreen: dryv
    .operation()
    .role("detail")
    .description("The home screen: served countries and the languages offered, localized.")
    .input(inputs.Home)
    .output(documents.HomeScreen)
    .cache(CACHE.reference)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/frontend/home").input(input, dryv.queryObject()).output(output),
    })),
  GetPlaceScreen: dryv
    .operation()
    .role("detail")
    .description(
      "Everything a place page shows in one call: name, breadcrumb, divisions, headline figures, leaders, projects, upcoming events and articles. Without a place, the country itself.",
    )
    .input(inputs.Place)
    .output(documents.PlaceScreen)
    .failures(f.NotFound)
    .cache(CACHE.structure)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/frontend/place").input(input, dryv.queryObject()).output(output),
    })),
  SearchScreen: dryv
    .operation()
    .role("search")
    .description("Named things whose names start with the text, localized and told apart by their parent place.")
    .input(inputs.Search)
    .output(documents.SearchResults)
    .cache(CACHE.structure)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/frontend/search").input(input, dryv.queryObject()).output(output),
    })),
  GetInstitutionScreen: dryv
    .operation()
    .role("detail")
    .description("An institution page: its name, arm and offices with their current holders.")
    .input(inputs.Institution)
    .output(documents.InstitutionScreen)
    .failures(f.NotFound)
    .cache(CACHE.structure)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/frontend/institution").input(input, dryv.queryObject()).output(output),
    })),
  GetRankingScreen: dryv
    .operation()
    .role("detail")
    .description("One indicator across the places of a country, ranked, for one year (latest when omitted).")
    .input(inputs.Ranking)
    .output(documents.RankingScreen)
    .failures(f.NotFound)
    .cache(CACHE.figures)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/frontend/ranking").input(input, dryv.queryObject()).output(output),
    })),
  GetCopyBundle: dryv
    .operation()
    .role("detail")
    .description("The interface messages of an app in the reader's language, falling back per key to English.")
    .input(inputs.Copy)
    .output(documents.CopyBundle)
    .cache(CACHE.reference)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/frontend/copy").input(input, dryv.queryObject()).output(output),
    })),
});
