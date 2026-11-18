/**
 * Locality: "my place" reads composed for screens, not table dumps.
 *
 * A visitor gives a position (or searches a name) and gets one document: the chain of units that contain it
 * (country, county, constituency, ward), who holds the offices scoped to those units, a summary of public procurement
 * there, media, and the evidence behind each claim. Names come back in the requested language with a fallback, and the
 * response says which language it served and what is missing (`gaps`) so a screen never implies completeness.
 *
 * The operations have no generated query: each is a hand-written use case over the existing tables (geography,
 * governance, official, politics, civic, source, filesystem). No table changes are required.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties as p } from "#/schemas/_shared.ts";
import { apiHttp } from "./_shared.ts";

export const locality = dryv.group({ name: "locality" }).description("Place-centred reads composed for screens.");
const reads = locality.feature("Places").failureDefaults(apiHttp);

const coordinates = locality.properties({
  Longitude: dryv.property.number.double({ range: { min: -180, max: 180 } }),
  Latitude: dryv.property.number.double({ range: { min: -90, max: 90 } }),
  Amount: dryv.property.number.double({ range: { min: 0 } }),
  LanguageCode: dryv.property.string().length({ min: 2, max: 35 }),
  SearchText: dryv.property.string().length({ min: 2, max: 100 }),
});

/** Shapes a screen shows: evidence, media, units, office holders, procurement. */
const shapes = locality.schemas({
  EvidenceRef: dryv.schema({
    citationId: dryv.field(p.Id),
    sourceName: dryv.field(p.Name),
    publisherName: dryv.field(p.Name).maybe(),
    artifactTitle: dryv.field(p.Name).maybe(),
    locator: dryv.field(p.NonEmptyString500).maybe(),
    retrievedAt: dryv.field(p.Instant).maybe(),
    verification: dryv.field(p.NonEmptyString100).maybe(),
    confidence: dryv.field(p.Confidence).maybe(),
  }),
  MediaRef: dryv.schema({
    fileVersionId: dryv.field(p.Id),
    kind: dryv.field(p.NonEmptyString100),
    title: dryv.field(p.Name).maybe(),
    mimeType: dryv.field(p.NonEmptyString100).maybe(),
    url: dryv.field(p.NonEmptyString1000).maybe(),
  }),
  LocalityUnit: dryv.schema({
    featureId: dryv.field(p.Id).tags("option:value"),
    code: dryv.field(p.IdentityCode),
    kindCode: dryv.field(p.IdentityCode),
    kindLabel: dryv.field(p.Name),
    name: dryv.field(p.Name).tags("option:label"),
    depth: dryv.field(p.NonNegativeInteger),
  }),
  LanguageChoice: dryv.schema({
    code: dryv.field(coordinates.LanguageCode).tags("option:value"),
    name: dryv.field(p.Name).tags("option:label"),
    nativeName: dryv.field(p.Name).maybe(),
  }),
});

const composed = locality.schemas({
  OfficeHolder: dryv.schema({
    holderId: dryv.field(p.Id),
    officeCode: dryv.field(p.IdentityCode),
    officeTitle: dryv.field(p.Name),
    unitFeatureId: dryv.field(p.Id).maybe(),
    unitName: dryv.field(p.Name).maybe(),
    personName: dryv.field(p.Name),
    partyName: dryv.field(p.Name).maybe(),
    tookOfficeOn: dryv.field(p.CalendarDate).maybe(),
    leftOfficeOn: dryv.field(p.CalendarDate).maybe(),
    portrait: dryv.field(shapes.MediaRef).maybe(),
    evidence: dryv.field(shapes.EvidenceRef).array(),
  }),
  ProcurementItem: dryv.schema({
    procurementId: dryv.field(p.Id),
    title: dryv.field(p.Name),
    status: dryv.field(p.NonEmptyString100).maybe(),
    amount: dryv.field(coordinates.Amount).maybe(),
    currency: dryv.field(p.NonEmptyString100).maybe(),
    awardedTo: dryv.field(p.Name).maybe(),
    year: dryv.field(p.Integer).maybe(),
    evidence: dryv.field(shapes.EvidenceRef).array(),
  }),
});

const summaries = locality.schemas({
  ProcurementSummary: dryv.schema({
    count: dryv.field(p.NonNegativeInteger),
    totalAmount: dryv.field(coordinates.Amount).maybe(),
    currency: dryv.field(p.NonEmptyString100).maybe(),
    recent: dryv.field(composed.ProcurementItem).array(),
  }),
});

/** The screen document of one place. */
const documents = locality.schemas({
  LocalityProfile: dryv.schema({
    place: dryv.field(shapes.LocalityUnit),
    chain: dryv.field(shapes.LocalityUnit).array(),
    officials: dryv.field(composed.OfficeHolder).array(),
    procurement: dryv.field(summaries.ProcurementSummary),
    media: dryv.field(shapes.MediaRef).array(),
    languageRequested: dryv.field(coordinates.LanguageCode).maybe(),
    languageServed: dryv.field(coordinates.LanguageCode),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  LocalityMatches: dryv.schema({ places: dryv.field(shapes.LocalityUnit).array() }),
  LanguageList: dryv.schema({ languages: dryv.field(shapes.LanguageChoice).array() }),
  // A source here is a published product (a dataset or legal text); `sourceId` is the product's id.
  SourceEntry: dryv.schema({
    sourceId: dryv.field(p.Id),
    code: dryv.field(p.IdentityCode),
    name: dryv.field(p.Name),
    publisherName: dryv.field(p.Name).maybe(),
    artifactCount: dryv.field(p.NonNegativeInteger),
    citationCount: dryv.field(p.NonNegativeInteger),
  }),
  EvidenceDetail: dryv.schema({
    evidence: dryv.field(shapes.EvidenceRef),
    // Absent when the artifact is a prepared seed file rather than something fetched from a source.
    sourceId: dryv.field(p.Id).maybe(),
    sourceCode: dryv.field(p.IdentityCode).maybe(),
    editionLabel: dryv.field(p.Name).maybe(),
    quotedText: dryv.field(p.Description).maybe(),
    files: dryv.field(shapes.MediaRef).array(),
  }),
});
const lists = locality.schemas({
  SourceCollection: dryv.schema({ sources: dryv.field(documents.SourceEntry).array() }),
});

/** Inputs. A place is named by position, by feature identity or by search text; every read takes an optional language. */
const inputs = locality.schemas({
  PositionInput: dryv.schema({
    latitude: dryv.field(coordinates.Latitude),
    longitude: dryv.field(coordinates.Longitude),
    languageCode: dryv.field(coordinates.LanguageCode).optional(),
    onDate: dryv.field(p.CalendarDate).optional(),
  }),
  PlaceInput: dryv.schema({
    featureId: dryv.field(p.Id),
    languageCode: dryv.field(coordinates.LanguageCode).optional(),
    onDate: dryv.field(p.CalendarDate).optional(),
  }),
  SearchInput: dryv.schema({
    query: dryv.field(coordinates.SearchText),
    languageCode: dryv.field(coordinates.LanguageCode).optional(),
    limit: dryv.field(p.Integer).optional().default(20),
  }),
  SourceSearchInput: dryv.schema({
    query: dryv.field(p.NonEmptyString100).optional(),
    limit: dryv.field(p.Integer).optional().default(50),
  }),
  CitationInput: dryv.schema({ citationId: dryv.field(p.Id) }),
});

export const localityOperations = reads.operations({
  ResolveLocality: dryv
    .operation()
    .role("detail")
    .description(
      "Who and what serves the place at a position: the containing units, the office holders scoped to them, procurement there, media and the evidence for each claim, in the requested language.",
    )
    .input(inputs.PositionInput)
    .output(documents.LocalityProfile)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/locality/at").input(input, dryv.queryObject()).output(output),
    })),

  GetLocality: dryv
    .operation()
    .role("detail")
    .description("The same place document for a known feature, for visitors who pick a place by name instead of position.")
    .input(inputs.PlaceInput)
    .output(documents.LocalityProfile)
    .facets(({ inputField, output }) => ({
      http: dryv
        .http("GET", "/v1/locality/{featureId}")
        .input(inputField("featureId"), dryv.path())
        .input(inputField("languageCode"), dryv.query("languageCode"))
        .output(output),
    })),

  SearchLocalities: dryv
    .operation()
    .role("search")
    .description("Places whose name matches the text, in any language, narrowest units first.")
    .input(inputs.SearchInput)
    .output(documents.LocalityMatches)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/locality/search").input(input, dryv.queryObject()).output(output),
    })),

  ListLanguages: dryv
    .operation()
    .role("list")
    .description("The languages the system can serve names and labels in, for a language picker.")
    .output(documents.LanguageList)
    .facets(({ output }) => ({ http: dryv.http("GET", "/v1/languages").output(output) })),

  BrowseSources: dryv
    .operation()
    .role("list")
    .description("The data sources behind the platform, with their publisher and how many artifacts and citations each has.")
    .input(inputs.SourceSearchInput)
    .output(lists.SourceCollection)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/sources").input(input, dryv.queryObject()).output(output),
    })),

  GetEvidence: dryv
    .operation()
    .role("detail")
    .description("One citation with its source, edition, quoted text and the files it points at.")
    .input(inputs.CitationInput)
    .output(documents.EvidenceDetail)
    .facets(({ inputField, output }) => ({
      http: dryv.http("GET", "/v1/evidence/{citationId}").input(inputField("citationId"), dryv.path()).output(output),
    })),
});
