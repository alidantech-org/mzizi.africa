/** Explicit-country setup and explorer documents for the handwritten web app. */
import * as dryv from "@dryvcode/author";
import { sharedProperties as p } from "#/schemas/_shared.ts";
import { countryProperties } from "#/schemas/postgres/reference.ts";
import { apiHttp } from "./_shared.ts";

export const explorer = dryv
  .group({ name: "explorer" })
  .description("Setup and canonical place exploration without an inferred default country.");
const feature = explorer.feature("Explorer").failureDefaults(apiHttp);
const props = explorer.properties({
  LanguageCode: dryv.property.string().length({ min: 2, max: 35 }),
  Path: dryv.property.string().length({ min: 1, max: 1500 }),
  Query: dryv.property.string().length({ min: 2, max: 100 }),
  Limit: dryv.property.number.integer({ range: { min: 1, max: 100 } }),
  Latitude: dryv.property.number.double({ range: { min: -90, max: 90 } }),
  Longitude: dryv.property.number.double({ range: { min: -180, max: 180 } }),
  Accuracy: dryv.property.number.double({ range: { min: 0, max: 100000 } }),
  HexColor: dryv.property.string().length({ min: 7, max: 7 }),
  Share: dryv.property.number.double({ range: { min: 0, max: 1 } }),
  Degrees: dryv.property.number.double({ range: { min: -180, max: 180 } }),
  SimplifyDegrees: dryv.property.number.double({ range: { min: 0, max: 2 } }),
  BoundaryMode: dryv.property.enum({ Self: "self", Children: "children" }),
  CopyArea: dryv.property.string().length({ min: 1, max: 100 }),
  CopyHash: dryv.property.string().length({ min: 8, max: 64 }),
  ResolutionStatus: dryv.property.enum({ Matched: "matched", Ambiguous: "ambiguous", Unresolved: "unresolved" }),
});
const flag = explorer.schemas({
  FlagColor: dryv.schema({
    /** The nearest basic colour name, only a label for what was measured. */
    label: dryv.field(p.Name),
    /** The measured colour as `#rrggbb`. */
    hex: dryv.field(props.HexColor),
    /** The share of the flag this colour covers, between 0 and 1. */
    share: dryv.field(props.Share),
  }),
});
const rows = explorer.schemas({
  CountryChoice: dryv.schema({
    id: dryv.field(p.Id),
    code: dryv.field(countryProperties.IsoAlpha2),
    name: dryv.field(p.Name),
    served: dryv.field(p.Flag),
    rootFeatureId: dryv.field(p.Id).maybe(),
    flagUrl: dryv.field(p.Url).maybe(),
    /** Colours measured from the registered flag file; empty when the flag has no measured colours. */
    flagColors: dryv.field(flag.FlagColor).array(),
  }),
  LanguageChoice: dryv.schema({
    code: dryv.field(props.LanguageCode),
    /** The language named in the requested interface language (an exonym, or the endonym when it is the same language). */
    name: dryv.field(p.Name),
    /** The language named in itself, as recorded in reference.language_names. */
    nativeName: dryv.field(p.Name).maybe(),
  }),
  NavigationItem: dryv.schema({
    /** A subject id of the app's navigation (`elections`, `leaders`, ...). */
    view: dryv.field(p.NonEmptyString255),
    /** True when recorded data exists for the country; never decided by the client. */
    available: dryv.field(p.Flag),
  }),
  CopyEntry: dryv.schema({ key: dryv.field(p.NonEmptyString255), text: dryv.field(p.Description) }),
  Place: dryv.schema({
    featureId: dryv.field(p.Id),
    code: dryv.field(p.NonEmptyString255),
    countryCode: dryv.field(countryProperties.IsoAlpha2),
    name: dryv.field(p.Name),
    nameLanguage: dryv.field(props.LanguageCode).maybe(),
    kind: dryv.field(p.Name),
    canonicalPath: dryv.field(props.Path),
    depth: dryv.field(p.NonNegativeInteger),
    parentFeatureId: dryv.field(p.Id).maybe(),
    /** The name of the place directly above this one, in the requested language; absent for the country itself. */
    parentName: dryv.field(p.Name).maybe(),
    /** The reference value code of its kind, so a client can pick an icon without comparing words. */
    kindCode: dryv.field(p.NonEmptyString255),
    citationCount: dryv.field(p.NonNegativeInteger),
  }),
  Level: dryv.schema({
    depth: dryv.field(p.NonNegativeInteger),
    kindCode: dryv.field(p.NonEmptyString255),
    label: dryv.field(p.Name),
  }),
  Count: dryv.schema({ label: dryv.field(p.Name), value: dryv.field(p.NonNegativeInteger) }),
});
const documents = explorer.schemas({
  Navigation: dryv.schema({
    country: dryv.field(rows.CountryChoice),
    items: dryv.field(rows.NavigationItem).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  CopyBundle: dryv.schema({
    language: dryv.field(props.LanguageCode),
    /** Content hash of the entries, so a client can cache the bundle for as long as it is unchanged. */
    hash: dryv.field(props.CopyHash),
    entries: dryv.field(rows.CopyEntry).array(),
    /** Declared keys with no wording in this language; never filled from another language. */
    missing: dryv.field(p.NonEmptyString255).array(),
  }),
  Bootstrap: dryv.schema({
    countries: dryv.field(rows.CountryChoice).array(),
    languages: dryv.field(rows.LanguageChoice).array(),
    language: dryv.field(props.LanguageCode),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  Places: dryv.schema({
    places: dryv.field(rows.Place).array(),
    total: dryv.field(p.NonNegativeInteger),
    page: dryv.field(p.PositiveInteger),
    limit: dryv.field(props.Limit),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  Context: dryv.schema({
    country: dryv.field(rows.CountryChoice),
    place: dryv.field(rows.Place),
    chain: dryv.field(rows.Place).array(),
    levels: dryv.field(rows.Level).array(),
    language: dryv.field(props.LanguageCode),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  PlaceGroup: dryv.schema({
    /** One place on the way down (the country, an ancestor, the place itself) and the places directly inside it. */
    place: dryv.field(rows.Place),
    children: dryv.field(rows.Place).array(),
    total: dryv.field(p.NonNegativeInteger),
  }),
  AddressPlace: dryv.schema({
    /** The address as it was asked for, for example `/ke/nairobi/westlands`. */
    address: dryv.field(props.Path),
    place: dryv.field(rows.Place).maybe(),
  }),
  Resolution: dryv.schema({
    status: dryv.field(props.ResolutionStatus),
    candidates: dryv.field(rows.Place).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
});
const overview = explorer.schema("Overview", {
  context: dryv.field(documents.Context),
  children: dryv.field(documents.Places),
  counts: dryv.field(rows.Count).array(),
  gaps: dryv.field(p.NonEmptyString500).array(),
});
const boundaryShapes = explorer.schemas({
  BoundaryShape: dryv.schema({
    /** The place's readable address, for example `/ke/nairobi`; the shape belongs to it. */
    address: dryv.field(props.Path),
    name: dryv.field(p.Name),
    kind: dryv.field(p.Name),
    kindCode: dryv.field(p.NonEmptyString255),
    /** A GeoJSON geometry (`Polygon` or `MultiPolygon`, longitude then latitude), simplified for drawing a map. */
    geometry: dryv.field(p.JsonText),
    /** Western, southern, eastern and northern edges of the shape. */
    bbox: dryv.field(props.Degrees).array(),
  }),
});
const boundaries = explorer.schema("Boundaries", {
  /** The place the shapes were asked for, or the country. */
  place: dryv.field(rows.Place),
  shapes: dryv.field(boundaryShapes.BoundaryShape).array(),
  /** Western, southern, eastern and northern edges of every shape together. */
  bbox: dryv.field(props.Degrees).array(),
  /** Places inside the asked-for place that have no recorded boundary. */
  withoutBoundary: dryv.field(p.NonNegativeInteger),
  gaps: dryv.field(p.NonEmptyString500).array(),
});
const location = explorer.schema("Location", {
  context: dryv.field(documents.Context),
  /** The country's places directly below the root, then each ancestor's and the place's own children, outermost first. */
  groups: dryv.field(documents.PlaceGroup).array(),
  /** Places matching `find` and `kindCode`, one page; absent when neither was asked for. */
  found: dryv.field(documents.Places).maybe(),
  gaps: dryv.field(p.NonEmptyString500).array(),
});
const addresses = explorer.schema("Addresses", {
  places: dryv.field(documents.AddressPlace).array(),
  gaps: dryv.field(p.NonEmptyString500).array(),
});
const inputs = explorer.schemas({
  LocationInput: dryv.schema({
    countryCode: dryv.field(countryProperties.IsoAlpha2),
    /** The readable address below the country exactly as in the URL, for example `nairobi/westlands`; omit for the country. */
    path: dryv.field(props.Path).optional(),
    languageCode: dryv.field(props.LanguageCode).optional(),
    find: dryv.field(props.Query).optional(),
    kindCode: dryv.field(p.NonEmptyString255).optional(),
    page: dryv.field(p.PositiveInteger).optional(),
    limit: dryv.field(props.Limit).optional(),
  }),
  BoundariesInput: dryv.schema({
    countryCode: dryv.field(countryProperties.IsoAlpha2),
    /** The readable address below the country as in the URL; omit for the country. */
    path: dryv.field(props.Path).optional(),
    languageCode: dryv.field(props.LanguageCode).optional(),
    /** `self` draws the place itself; `children` draws the places directly inside it. Defaults to `children`. */
    mode: dryv.field(props.BoundaryMode).optional(),
    /** Simplification in degrees; a coarser value for a country-wide map, a finer one for a ward. */
    simplify: dryv.field(props.SimplifyDegrees).optional(),
    limit: dryv.field(props.Limit).optional(),
  }),
  AddressesInput: dryv.schema({
    /** Full addresses as they appear in URLs, for example `/ke/nairobi/westlands`. */
    addresses: dryv.field(props.Path).array(),
    languageCode: dryv.field(props.LanguageCode).optional(),
  }),
  BootstrapInput: dryv.schema({ languageCode: dryv.field(props.LanguageCode).optional() }),
  PlaceInput: dryv.schema({
    countryCode: dryv.field(countryProperties.IsoAlpha2),
    path: dryv.field(props.Path).optional(),
    featureId: dryv.field(p.Id).optional(),
    languageCode: dryv.field(props.LanguageCode).optional(),
  }),
  SearchInput: dryv.schema({
    countryCode: dryv.field(countryProperties.IsoAlpha2),
    /** Part of a place name; omit to list every place (of one kind) in stable name order. */
    query: dryv.field(props.Query).optional(),
    /** Only places of one kind, by its reference value code, for example the wards of a country. */
    kindCode: dryv.field(p.NonEmptyString255).optional(),
    parentFeatureId: dryv.field(p.Id).optional(),
    depth: dryv.field(p.NonNegativeInteger).optional(),
    languageCode: dryv.field(props.LanguageCode).optional(),
    page: dryv.field(p.PositiveInteger).optional(),
    limit: dryv.field(props.Limit).optional(),
  }),
  ChildrenInput: dryv.schema({
    countryCode: dryv.field(countryProperties.IsoAlpha2),
    featureId: dryv.field(p.Id).optional(),
    languageCode: dryv.field(props.LanguageCode).optional(),
    page: dryv.field(p.PositiveInteger).optional(),
    limit: dryv.field(props.Limit).optional(),
  }),
  NavigationInput: dryv.schema({ countryCode: dryv.field(countryProperties.IsoAlpha2) }),
  CopyInput: dryv.schema({
    languageCode: dryv.field(props.LanguageCode),
    countryCode: dryv.field(countryProperties.IsoAlpha2).optional(),
    /** Key prefix such as `app.shell`; omit for the whole language. */
    area: dryv.field(props.CopyArea).optional(),
  }),
  CoordinatesInput: dryv.schema({
    latitude: dryv.field(props.Latitude),
    longitude: dryv.field(props.Longitude),
    accuracyMeters: dryv.field(props.Accuracy).optional(),
    countryCode: dryv.field(countryProperties.IsoAlpha2).optional(),
    languageCode: dryv.field(props.LanguageCode).optional(),
  }),
});
export const explorerOperations = feature.operations({
  GetSetupBootstrap: dryv
    .operation()
    .role("detail")
    .description(
      "Country catalogue and the interface languages that have recorded wording. Never chooses a default country.",
    )
    .input(inputs.BootstrapInput)
    .output(documents.Bootstrap)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/explorer/setup").input(input, dryv.queryObject()).output(output),
    })),
  GetCopyBundle: dryv
    .operation()
    .role("detail")
    .description(
      "Every recorded wording for one language, optionally one area and country wording, with a content hash for long-lived caching. Words are never taken from another language.",
    )
    .input(inputs.CopyInput)
    .output(documents.CopyBundle)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/explorer/copy").input(input, dryv.queryObject()).output(output),
    })),
  GetExplorerNavigation: dryv
    .operation()
    .role("detail")
    .description(
      "Which navigation subjects have recorded data for one explicit country. Availability follows the data, not a list kept by the client.",
    )
    .input(inputs.NavigationInput)
    .output(documents.Navigation)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/explorer/navigation").input(input, dryv.queryObject()).output(output),
    })),
  GetExplorerLocation: dryv
    .operation()
    .role("detail")
    .description(
      "Everything the location UI shows for one place, resolved on the server from the readable address: the place, its chain, every level kind, the places inside the country root, each ancestor and the place, and one page of a search or level list. Clients send slugs, never identities.",
    )
    .input(inputs.LocationInput)
    .output(location.asRef())
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/explorer/location").input(input, dryv.queryObject()).output(output),
    })),
  GetExplorerBoundaries: dryv
    .operation()
    .role("detail")
    .description(
      "Simplified boundaries to draw a map: the place itself or the places directly inside it, from the recorded geometries, resolved from the readable address. Places with no recorded boundary are counted, never drawn.",
    )
    .input(inputs.BoundariesInput)
    .output(boundaries.asRef())
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/explorer/boundaries").input(input, dryv.queryObject()).output(output),
    })),
  ResolveExplorerAddresses: dryv
    .operation()
    .role("detail")
    .description("Names and places above them for a list of addresses (saved places), in one language. A body keeps the list out of the address.")
    .input(inputs.AddressesInput)
    .output(addresses.asRef())
    .facets(({ input, output }) => ({
      http: dryv.http("POST", "/v1/explorer/addresses").input(input, dryv.body()).output(output),
    })),
  GetExplorerContext: dryv
    .operation()
    .role("detail")
    .description("Resolve an explicit country and registered place path or identity; incompatible identities are rejected.")
    .input(inputs.PlaceInput)
    .output(documents.Context)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/explorer/context").input(input, dryv.queryObject()).output(output),
    })),
  SearchExplorerPlaces: dryv
    .operation()
    .role("search")
    .description("Country-scoped registered places with stable pagination and canonical destinations.")
    .input(inputs.SearchInput)
    .output(documents.Places)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/explorer/search").input(input, dryv.queryObject()).output(output),
    })),
  ListExplorerChildren: dryv
    .operation()
    .role("list")
    .description("Direct children in the recorded routing hierarchy of one explicit country.")
    .input(inputs.ChildrenInput)
    .output(documents.Places)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/explorer/children").input(input, dryv.queryObject()).output(output),
    })),
  ResolveExplorerCoordinates: dryv
    .operation()
    .role("detail")
    .description(
      "Read geographic candidates from recorded boundaries. POST keeps device coordinates out of shared query strings; it performs no writes.",
    )
    .input(inputs.CoordinatesInput)
    .output(documents.Resolution)
    .facets(({ input, output }) => ({
      http: dryv.http("POST", "/v1/explorer/resolve").input(input, dryv.body()).output(output),
    })),
  GetExplorerOverview: dryv
    .operation()
    .role("detail")
    .description(
      "One place's context, direct children and recorded coverage counts; never substitutes demonstration measures.",
    )
    .input(inputs.PlaceInput)
    .output(overview.asRef())
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/explorer/overview").input(input, dryv.queryObject()).output(output),
    })),
});
