/**
 * Insights: statistics, leaderboards, elections, legislative activity, civic spending, tenders, leaders and search,
 * composed for screens. Like `locality`, none of these has a generated query; each is a hand-written use case over the
 * stored tables (statistics, activities, politics, civic, finance, official, governance, filesystem, source).
 *
 * Every document says what is missing (`gaps`), so a screen can offer "ask for this data" or "check the official source"
 * instead of implying completeness. Deep, screen-specific sections are open JSON (`dynamic`).
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties as p } from "#/schemas/_shared.ts";
import { apiHttp } from "./_shared.ts";

export const insights = dryv
  .group({ name: "insights" })
  .description("Statistics, elections, activity, civic spending and search composed for screens.");
const reads = insights.feature("Insights").failureDefaults(apiHttp);

const props = insights.properties({
  Text: dryv.property.string().length({ min: 1, max: 100 }),
  Code: dryv.property.string().length({ min: 1, max: 200 }),
  Limit: dryv.property.number.integer({ range: { min: 1, max: 500 } }),
  Count: dryv.property.number.integer({ range: { min: 0, max: 100000000 } }),
  Latitude: dryv.property.number.double({ range: { min: -90, max: 90 } }),
  Longitude: dryv.property.number.double({ range: { min: -180, max: 180 } }),
});

const shapes = insights.schemas({
  /** One legal instrument (constitution, act, regulation) with its kind and size, highest authority first in the list. */
  LawInstrument: dryv.schema({
    code: dryv.field(props.Code),
    name: dryv.field(p.NonEmptyString500),
    kindCode: dryv.field(props.Code),
    kindLabel: dryv.field(p.NonEmptyString500),
    enactedOn: dryv.field(p.CalendarDate).maybe(),
    provisions: dryv.field(props.Count),
  }),
  SearchHit: dryv.schema({
    kind: dryv.field(p.NonEmptyString100),
    kindLabel: dryv.field(p.NonEmptyString100),
    id: dryv.field(p.Id),
    code: dryv.field(p.Name).maybe(),
    title: dryv.field(p.Name),
    subtitle: dryv.field(p.NonEmptyString500).maybe(),
    path: dryv.field(p.Name).array(),
    featureId: dryv.field(p.Id).maybe(),
    imageUrl: dryv.field(p.NonEmptyString1000).maybe(),
  }),
  PlaceCrumb: dryv.schema({
    featureId: dryv.field(p.Id),
    name: dryv.field(p.Name),
    kindCode: dryv.field(p.IdentityCode),
    kindLabel: dryv.field(p.Name),
    path: dryv.field(p.NonEmptyString500).maybe(),
  }),
  PlaceChild: dryv.schema({
    featureId: dryv.field(p.Id),
    name: dryv.field(p.Name),
    kindCode: dryv.field(p.IdentityCode),
    kindLabel: dryv.field(p.Name),
    path: dryv.field(p.NonEmptyString500).maybe(),
    childCount: dryv.field(p.NonNegativeInteger),
    population: dryv.field(p.Number).maybe(),
  }),
  LeaderboardMetric: dryv.schema({
    code: dryv.field(props.Code),
    title: dryv.field(p.Name),
    domain: dryv.field(p.NonEmptyString100),
    unit: dryv.field(p.NonEmptyString100).maybe(),
    higherIsBetter: dryv.field(p.Flag),
    describe: dryv.field(p.Description),
  }),
  LeaderboardRow: dryv.schema({
    rank: dryv.field(p.PositiveInteger),
    featureId: dryv.field(p.Id).maybe(),
    subjectId: dryv.field(p.Id).maybe(),
    name: dryv.field(p.Name),
    detail: dryv.field(p.NonEmptyString500).maybe(),
    value: dryv.field(p.Number),
    share: dryv.field(p.Number).maybe(),
  }),
});

const documents = insights.schemas({
  SearchResults: dryv.schema({
    query: dryv.field(p.NonEmptyString500),
    total: dryv.field(p.NonNegativeInteger),
    counts: dryv.field(dryv.dynamic()),
    hits: dryv.field(shapes.SearchHit).array(),
  }),
  PlaceBrowse: dryv.schema({
    place: dryv.field(shapes.PlaceCrumb).maybe(),
    chain: dryv.field(shapes.PlaceCrumb).array(),
    children: dryv.field(shapes.PlaceChild).array(),
    media: dryv.field(dryv.dynamic()).array(),
  }),
  LeaderboardMetricList: dryv.schema({ metrics: dryv.field(shapes.LeaderboardMetric).array() }),
  Leaderboard: dryv.schema({
    metric: dryv.field(shapes.LeaderboardMetric),
    scope: dryv.field(p.NonEmptyString500),
    rows: dryv.field(shapes.LeaderboardRow).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  /** Statistics of one place: topics with latest figures, history, breakdowns and how it compares. */
  PlaceStatistics: dryv.schema({
    place: dryv.field(shapes.PlaceCrumb),
    chain: dryv.field(shapes.PlaceCrumb).array(),
    topics: dryv.field(dryv.dynamic()).array(),
    breakdowns: dryv.field(dryv.dynamic()),
    comparisons: dryv.field(dryv.dynamic()).array(),
    siblings: dryv.field(dryv.dynamic()),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  IndicatorSeries: dryv.schema({
    indicator: dryv.field(dryv.dynamic()),
    place: dryv.field(shapes.PlaceCrumb),
    points: dryv.field(dryv.dynamic()).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  /** One value per child unit, for a choropleth, with each unit's outline id. */
  IndicatorMap: dryv.schema({
    indicator: dryv.field(dryv.dynamic()),
    parent: dryv.field(shapes.PlaceCrumb).maybe(),
    periodFrom: dryv.field(p.CalendarDate).maybe(),
    units: dryv.field(dryv.dynamic()).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  PlaceElections: dryv.schema({
    place: dryv.field(shapes.PlaceCrumb),
    elections: dryv.field(dryv.dynamic()).array(),
    registrationTrend: dryv.field(dryv.dynamic()).array(),
    turnoutTrend: dryv.field(dryv.dynamic()).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  ElectionList: dryv.schema({ elections: dryv.field(dryv.dynamic()).array() }),
  ElectionDetail: dryv.schema({
    election: dryv.field(dryv.dynamic()),
    contests: dryv.field(dryv.dynamic()).array(),
    totals: dryv.field(dryv.dynamic()).array(),
    units: dryv.field(dryv.dynamic()).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  PartyList: dryv.schema({ parties: dryv.field(dryv.dynamic()).array(), gaps: dryv.field(p.NonEmptyString500).array() }),
  PartyDetail: dryv.schema({
    party: dryv.field(dryv.dynamic()),
    members: dryv.field(dryv.dynamic()).array(),
    results: dryv.field(dryv.dynamic()).array(),
    funding: dryv.field(dryv.dynamic()).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  LawList: dryv.schema({
    instruments: dryv.field(shapes.LawInstrument).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  MotionList: dryv.schema({ motions: dryv.field(dryv.dynamic()).array() }),
  /** One motion with every member's position, for a hemicycle ("round table") of dots. */
  MotionDetail: dryv.schema({
    motion: dryv.field(dryv.dynamic()),
    tally: dryv.field(dryv.dynamic()),
    parties: dryv.field(dryv.dynamic()).array(),
    members: dryv.field(dryv.dynamic()).array(),
    legal: dryv.field(dryv.dynamic()).maybe(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  LeaderProfile: dryv.schema({
    leader: dryv.field(dryv.dynamic()),
    offices: dryv.field(dryv.dynamic()).array(),
    contacts: dryv.field(dryv.dynamic()).array(),
    media: dryv.field(dryv.dynamic()).array(),
    activity: dryv.field(dryv.dynamic()),
    election: dryv.field(dryv.dynamic()).array(),
    fund: dryv.field(dryv.dynamic()).maybe(),
    evidence: dryv.field(dryv.dynamic()).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  PlaceCivic: dryv.schema({
    place: dryv.field(shapes.PlaceCrumb),
    chain: dryv.field(shapes.PlaceCrumb).array(),
    fund: dryv.field(dryv.dynamic()).maybe(),
    years: dryv.field(dryv.dynamic()).array(),
    classes: dryv.field(dryv.dynamic()).array(),
    projects: dryv.field(dryv.dynamic()).array(),
    infrastructure: dryv.field(dryv.dynamic()),
    leadership: dryv.field(dryv.dynamic()).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  ProjectDetail: dryv.schema({
    project: dryv.field(dryv.dynamic()),
    money: dryv.field(dryv.dynamic()).array(),
    procurement: dryv.field(dryv.dynamic()).maybe(),
    media: dryv.field(dryv.dynamic()).array(),
    evidence: dryv.field(dryv.dynamic()).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  LeaderTree: dryv.schema({
    place: dryv.field(shapes.PlaceCrumb).maybe(),
    levels: dryv.field(dryv.dynamic()).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  InstitutionList: dryv.schema({
    arms: dryv.field(dryv.dynamic()).array(),
    total: dryv.field(p.NonNegativeInteger),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  InstitutionDetail: dryv.schema({
    institution: dryv.field(dryv.dynamic()),
    leaders: dryv.field(dryv.dynamic()).array(),
    legalBasis: dryv.field(dryv.dynamic()).array(),
    content: dryv.field(dryv.dynamic()).array(),
    parents: dryv.field(dryv.dynamic()).array(),
    children: dryv.field(dryv.dynamic()).array(),
    metrics: dryv.field(dryv.dynamic()).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  GovernanceTabs: dryv.schema({
    tabs: dryv.field(dryv.dynamic()).array(),
    arms: dryv.field(dryv.dynamic()).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  GovernanceTree: dryv.schema({
    tab: dryv.field(dryv.dynamic()),
    place: dryv.field(shapes.PlaceCrumb).maybe(),
    nodes: dryv.field(dryv.dynamic()).array(),
    edges: dryv.field(dryv.dynamic()).array(),
    rail: dryv.field(dryv.dynamic()).array(),
    legend: dryv.field(dryv.dynamic()).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  ContentPage: dryv.schema({
    content: dryv.field(dryv.dynamic()).maybe(),
    related: dryv.field(dryv.dynamic()).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  ContentList: dryv.schema({
    items: dryv.field(dryv.dynamic()).array(),
    categories: dryv.field(dryv.dynamic()).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  LegalBasis: dryv.schema({
    subject: dryv.field(dryv.dynamic()),
    items: dryv.field(dryv.dynamic()).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  CompareOptions: dryv.schema({
    place: dryv.field(dryv.dynamic()),
    nearby: dryv.field(dryv.dynamic()).array(),
    top: dryv.field(dryv.dynamic()).array(),
    hierarchy: dryv.field(dryv.dynamic()).array(),
    metrics: dryv.field(dryv.dynamic()).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  Comparison: dryv.schema({
    a: dryv.field(dryv.dynamic()),
    b: dryv.field(dryv.dynamic()),
    rows: dryv.field(dryv.dynamic()).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  NearbyProjects: dryv.schema({
    radiusKm: dryv.field(p.Number),
    projects: dryv.field(dryv.dynamic()).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  TenderList: dryv.schema({
    summary: dryv.field(dryv.dynamic()),
    tenders: dryv.field(dryv.dynamic()).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
});

const inputs = insights.schemas({
  SearchQuery: dryv.schema({
    query: dryv.field(props.Text),
    kinds: dryv.field(p.NonEmptyString500).optional(),
    limit: dryv.field(props.Limit).optional(),
    languageCode: dryv.field(p.NonEmptyString100).optional(),
  }),
  BrowseInput: dryv.schema({ featureId: dryv.field(p.Id).optional() }),
  PlaceOnly: dryv.schema({ featureId: dryv.field(p.Id) }),
  SeriesInput: dryv.schema({ indicatorCode: dryv.field(props.Code), featureId: dryv.field(p.Id) }),
  MapInput: dryv.schema({
    indicatorCode: dryv.field(props.Code),
    parentFeatureId: dryv.field(p.Id).optional(),
    kindCode: dryv.field(p.IdentityCode).optional(),
  }),
  BoardInput: dryv.schema({
    metricCode: dryv.field(props.Code),
    kindCode: dryv.field(p.IdentityCode).optional(),
    parentFeatureId: dryv.field(p.Id).optional(),
    limit: dryv.field(props.Limit).optional(),
  }),
  ElectionInput: dryv.schema({
    electionId: dryv.field(p.Id),
    parentFeatureId: dryv.field(p.Id).optional(),
    contestKind: dryv.field(p.NonEmptyString100).optional(),
  }),
  CodeInput: dryv.schema({ code: dryv.field(props.Code) }),
  IdInput: dryv.schema({ id: dryv.field(p.Id) }),
  LawInput: dryv.schema({ kindCode: dryv.field(props.Code).optional() }),
  MotionsInput: dryv.schema({ institutionId: dryv.field(p.Id).optional(), limit: dryv.field(props.Limit).optional() }),
  InstitutionsInput: dryv.schema({
    armCode: dryv.field(props.Code).optional(),
    kindCode: dryv.field(props.Code).optional(),
    query: dryv.field(props.Text).optional(),
  }),
  GovTreeInput: dryv.schema({
    tab: dryv.field(props.Code).optional(),
    institution: dryv.field(props.Code).optional(),
    featureId: dryv.field(p.Id).optional(),
  }),
  ContentInput: dryv.schema({
    slug: dryv.field(p.NonEmptyString255).optional(),
    subjectTable: dryv.field(p.NonEmptyString100).optional(),
    subjectCode: dryv.field(props.Code).optional(),
    languageCode: dryv.field(p.NonEmptyString100).optional(),
  }),
  ContentListInput: dryv.schema({
    category: dryv.field(props.Code).optional(),
    tag: dryv.field(props.Code).optional(),
    query: dryv.field(props.Text).optional(),
    languageCode: dryv.field(p.NonEmptyString100).optional(),
    limit: dryv.field(props.Limit).optional(),
  }),
  LegalBasisInput: dryv.schema({
    subjectTable: dryv.field(p.NonEmptyString100),
    subjectCode: dryv.field(props.Code),
  }),
  CompareOptionsInput: dryv.schema({ featureId: dryv.field(p.Id), metric: dryv.field(props.Code).optional() }),
  ComparisonInput: dryv.schema({
    a: dryv.field(p.Id),
    b: dryv.field(p.Id),
    metrics: dryv.field(p.NonEmptyString1000).optional(),
  }),
  TreeInput: dryv.schema({ featureId: dryv.field(p.Id).optional() }),
  NearbyInput: dryv.schema({
    latitude: dryv.field(props.Latitude),
    longitude: dryv.field(props.Longitude),
    radiusKm: dryv.field(p.Number).optional(),
  }),
  TenderInput: dryv.schema({
    status: dryv.field(p.NonEmptyString100).optional(),
    featureId: dryv.field(p.Id).optional(),
    limit: dryv.field(props.Limit).optional(),
  }),
});

export const insightOperations = reads.operations({
  GlobalSearch: dryv
    .operation()
    .role("search")
    .description(
      "One search over places, leaders, parties, projects, tenders, indicators, sources and laws; every hit says what it is.",
    )
    .input(inputs.SearchQuery)
    .output(documents.SearchResults)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/search").input(input, dryv.queryObject()).output(output),
    })),

  BrowsePlaces: dryv
    .operation()
    .role("list")
    .description(
      "The country's hierarchy one level at a time (county, constituency, ward, town, village), with the path to the current unit.",
    )
    .input(inputs.BrowseInput)
    .output(documents.PlaceBrowse)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/browse").input(input, dryv.queryObject()).output(output),
    })),

  GetPlaceStatistics: dryv
    .operation()
    .role("detail")
    .description(
      "Population and other statistics of a place, by topic, with history, breakdowns and comparison to its parents.",
    )
    .input(inputs.PlaceOnly)
    .output(documents.PlaceStatistics)
    .facets(({ inputField, output }) => ({
      http: dryv.http("GET", "/v1/statistics/places/{featureId}").input(inputField("featureId"), dryv.path()).output(output),
    })),

  GetIndicatorSeries: dryv
    .operation()
    .role("detail")
    .description("One indicator over time for one place, optionally broken down.")
    .input(inputs.SeriesInput)
    .output(documents.IndicatorSeries)
    .facets(({ inputField, output }) => ({
      http: dryv
        .http("GET", "/v1/statistics/indicators/{indicatorCode}/series")
        .input(inputField("indicatorCode"), dryv.path())
        .input(inputField("featureId"), dryv.query("featureId"))
        .output(output),
    })),

  GetIndicatorMap: dryv
    .operation()
    .role("detail")
    .description("One indicator's latest value for each unit under a parent, for a heat map.")
    .input(inputs.MapInput)
    .output(documents.IndicatorMap)
    .facets(({ inputField, output }) => ({
      http: dryv
        .http("GET", "/v1/statistics/indicators/{indicatorCode}/map")
        .input(inputField("indicatorCode"), dryv.path())
        .input(inputField("parentFeatureId"), dryv.query("parentFeatureId"))
        .input(inputField("kindCode"), dryv.query("kindCode"))
        .output(output),
    })),

  ListLeaderboardMetrics: dryv
    .operation()
    .role("list")
    .description("What places can be ranked by: statistics, finance, civic delivery, procurement and elections.")
    .output(documents.LeaderboardMetricList)
    .facets(({ output }) => ({ http: dryv.http("GET", "/v1/leaderboards").output(output) })),

  GetLeaderboard: dryv
    .operation()
    .role("detail")
    .description("Places (or leaders, parties) ranked by one metric, within a parent area and a level.")
    .input(inputs.BoardInput)
    .output(documents.Leaderboard)
    .facets(({ inputField, output }) => ({
      http: dryv
        .http("GET", "/v1/leaderboards/{metricCode}")
        .input(inputField("metricCode"), dryv.path())
        .input(inputField("kindCode"), dryv.query("kindCode"))
        .input(inputField("parentFeatureId"), dryv.query("parentFeatureId"))
        .input(inputField("limit"), dryv.query("limit"))
        .output(output),
    })),

  GetPlaceElections: dryv
    .operation()
    .role("detail")
    .description("Elections in a place over time: who won, with what votes, turnout and the registration trend.")
    .input(inputs.PlaceOnly)
    .output(documents.PlaceElections)
    .facets(({ inputField, output }) => ({
      http: dryv.http("GET", "/v1/elections/places/{featureId}").input(inputField("featureId"), dryv.path()).output(output),
    })),

  ListElections: dryv
    .operation()
    .role("list")
    .description("Every election the system knows, newest first.")
    .output(documents.ElectionList)
    .facets(({ output }) => ({ http: dryv.http("GET", "/v1/elections").output(output) })),

  GetElection: dryv
    .operation()
    .role("detail")
    .description("One election: its contests, and results by unit under a parent, for tables and heat maps.")
    .input(inputs.ElectionInput)
    .output(documents.ElectionDetail)
    .facets(({ inputField, output }) => ({
      http: dryv
        .http("GET", "/v1/elections/{electionId}")
        .input(inputField("electionId"), dryv.path())
        .input(inputField("parentFeatureId"), dryv.query("parentFeatureId"))
        .input(inputField("contestKind"), dryv.query("contestKind"))
        .output(output),
    })),

  ListParties: dryv
    .operation()
    .role("list")
    .description("Political parties ranked by members, votes and fund allocation.")
    .output(documents.PartyList)
    .facets(({ output }) => ({ http: dryv.http("GET", "/v1/parties").output(output) })),

  GetParty: dryv
    .operation()
    .role("detail")
    .description("One party: members list, votes obtained by election and fund allocation.")
    .input(inputs.CodeInput)
    .output(documents.PartyDetail)
    .facets(({ inputField, output }) => ({
      http: dryv.http("GET", "/v1/parties/{code}").input(inputField("code"), dryv.path()).output(output),
    })),

  ListLaw: dryv
    .operation()
    .role("list")
    .description("Legal instruments held, highest authority first (constitution, then acts, then regulations), with their size.")
    .input(inputs.LawInput)
    .output(documents.LawList)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/law").input(input, dryv.queryObject()).output(output),
    })),

  ListMotions: dryv
    .operation()
    .role("list")
    .description("Motions, bills and decisions of public bodies, newest first.")
    .input(inputs.MotionsInput)
    .output(documents.MotionList)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/motions").input(input, dryv.queryObject()).output(output),
    })),

  GetMotion: dryv
    .operation()
    .role("detail")
    .description(
      "One motion with the position of every member (yes, no, abstained, absent), the law or budget it concerns and the tally.",
    )
    .input(inputs.CodeInput)
    .output(documents.MotionDetail)
    .facets(({ inputField, output }) => ({
      http: dryv.http("GET", "/v1/motions/{code}").input(inputField("code"), dryv.path()).output(output),
    })),

  GetLeaderProfile: dryv
    .operation()
    .role("detail")
    .description("A leader: offices, contacts, media, voting and attendance record, the fund they oversee and evidence.")
    .input(inputs.IdInput)
    .output(documents.LeaderProfile)
    .facets(({ inputField, output }) => ({
      http: dryv.http("GET", "/v1/leaders/{id}").input(inputField("id"), dryv.path()).output(output),
    })),

  GetPlaceCivic: dryv
    .operation()
    .role("detail")
    .description(
      "Civic delivery in a place: fund allocations and spending by class and year, projects with locations, infrastructure and leadership.",
    )
    .input(inputs.PlaceOnly)
    .output(documents.PlaceCivic)
    .facets(({ inputField, output }) => ({
      http: dryv.http("GET", "/v1/civic/places/{featureId}").input(inputField("featureId"), dryv.path()).output(output),
    })),

  GetProject: dryv
    .operation()
    .role("detail")
    .description("One project: where, who is responsible, the money, the procurement, pictures and evidence.")
    .input(inputs.CodeInput)
    .output(documents.ProjectDetail)
    .facets(({ inputField, output }) => ({
      http: dryv.http("GET", "/v1/projects/{code}").input(inputField("code"), dryv.path()).output(output),
    })),

  ListTenders: dryv
    .operation()
    .role("list")
    .description(
      "Tenders and contracts: open, ongoing, closed, awarded and complete, with suppliers, plus transparency information.",
    )
    .input(inputs.TenderInput)
    .output(documents.TenderList)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/tenders").input(input, dryv.queryObject()).output(output),
    })),

  GetNearbyProjects: dryv
    .operation()
    .role("list")
    .description(
      "Projects close to a position, nearest first, with status, who built them and the money, so a visitor sees what affects them.",
    )
    .input(inputs.NearbyInput)
    .output(documents.NearbyProjects)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/projects/near").input(input, dryv.queryObject()).output(output),
    })),

  GetLeaderTree: dryv
    .operation()
    .role("detail")
    .description(
      "The leaders above and at a place, as a family tree: national first, then county, constituency and ward, split into elected, appointed and nominated.",
    )
    .input(inputs.TreeInput)
    .output(documents.LeaderTree)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/leaders/tree").input(input, dryv.queryObject()).output(output),
    })),

  ListInstitutions: dryv
    .operation()
    .role("list")
    .description(
      "Every public body grouped by arm of government and kind, with what created it and how many leaders it has. The groups and labels come from the reference schemes.",
    )
    .input(inputs.InstitutionsInput)
    .output(documents.InstitutionList)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/institutions").input(input, dryv.queryObject()).output(output),
    })),

  GetInstitution: dryv
    .operation()
    .role("detail")
    .description(
      "One body: what it is for, what created it (with the Constitution articles or Acts), who leads it, the bodies it belongs to and oversees, and explanatory texts.",
    )
    .input(inputs.CodeInput)
    .output(documents.InstitutionDetail)
    .facets(({ inputField, output }) => ({
      http: dryv.http("GET", "/v1/institutions/{code}").input(inputField("code"), dryv.path()).output(output),
    })),

  GetGovernanceTabs: dryv
    .operation()
    .role("list")
    .description(
      "The ways to look at leaders (elected, nominated, appointed) and the bodies to switch to, all read from the reference schemes.",
    )
    .output(documents.GovernanceTabs)
    .facets(({ output }) => ({ http: dryv.http("GET", "/v1/governance/tabs").output(output) })),

  GetGovernanceTree: dryv
    .operation()
    .role("detail")
    .description(
      "A tree of leaders for one tab or one body: nodes with their tier, how they got the seat, a performance bar and the reference codes behind them; edges from superior to deputy or body to member; and a side rail of the levels of government.",
    )
    .input(inputs.GovTreeInput)
    .output(documents.GovernanceTree)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/governance/tree").input(input, dryv.queryObject()).output(output),
    })),

  GetContent: dryv
    .operation()
    .role("detail")
    .description(
      "One explanatory text by its address or by the record it is about, with image references resolved to addresses.",
    )
    .input(inputs.ContentInput)
    .output(documents.ContentPage)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/content").input(input, dryv.queryObject()).output(output),
    })),

  ListContent: dryv
    .operation()
    .role("list")
    .description("Explanatory texts by category or tag, for the Learn section.")
    .input(inputs.ContentListInput)
    .output(documents.ContentList)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/content/list").input(input, dryv.queryObject()).output(output),
    })),

  GetLegalBasis: dryv
    .operation()
    .role("detail")
    .description(
      "The Constitution articles and Acts that establish, authorise or govern one record (a body, an office, a place).",
    )
    .input(inputs.LegalBasisInput)
    .output(documents.LegalBasis)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/legal-basis").input(input, dryv.queryObject()).output(output),
    })),

  GetCompareOptions: dryv
    .operation()
    .role("list")
    .description(
      "Places worth comparing a place with: the ten closest by geography, the ten top performers, and the ladder of the units above it, saying plainly which rungs do not exist.",
    )
    .input(inputs.CompareOptionsInput)
    .output(documents.CompareOptions)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/compare/options").input(input, dryv.queryObject()).output(output),
    })),

  GetComparison: dryv
    .operation()
    .role("detail")
    .description("Two places on the same figures, aligned, with the difference in percent.")
    .input(inputs.ComparisonInput)
    .output(documents.Comparison)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/compare").input(input, dryv.queryObject()).output(output),
    })),
});
