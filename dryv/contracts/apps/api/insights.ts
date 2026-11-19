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

/** Sections of the screens' documents, typed from their real shapes (one named schema per object, children first). */
const sections0 = insights.schemas({
  PlaceBrowseMedia: dryv.schema({
    kind: dryv.field(p.String),
    title: dryv.field(p.String),
    url: dryv.field(p.String),
    thumbnailUrl: dryv.field(p.String).maybe(),
    platform: dryv.field(p.String).maybe(),
    embedUrl: dryv.field(p.String).maybe(),
    mimeType: dryv.field(p.String).maybe(),
    stored: dryv.field(p.Flag),
  }),
  PlaceStatisticsTopicsIndicatorsLatest: dryv.schema({
    period: dryv.field(p.String),
    value: dryv.field(p.Number),
    estimated: dryv.field(p.Flag),
  }),
  PlaceStatisticsTopicsIndicatorsPrevious: dryv.schema({
    period: dryv.field(p.String),
    value: dryv.field(p.Number),
    estimated: dryv.field(p.Flag),
  }),
  PlaceStatisticsTopicsIndicatorsSeries: dryv.schema({
    period: dryv.field(p.String),
    value: dryv.field(p.Number),
    estimated: dryv.field(p.Flag),
  }),
  PlaceStatisticsBreakdownsAge: dryv.schema({
    label: dryv.field(p.String),
    value: dryv.field(p.Number),
    share: dryv.field(p.Number),
  }),
  PlaceStatisticsBreakdownsCommunity: dryv.schema({
    label: dryv.field(p.String),
    value: dryv.field(p.Number),
    share: dryv.field(p.Number),
  }),
  PlaceStatisticsBreakdownsLanguage: dryv.schema({
    label: dryv.field(p.String),
    value: dryv.field(p.Number),
    share: dryv.field(p.Number),
  }),
  PlaceStatisticsBreakdownsResidence: dryv.schema({
    label: dryv.field(p.String),
    value: dryv.field(p.Number),
    share: dryv.field(p.Number),
  }),
  PlaceStatisticsBreakdownsSex: dryv.schema({
    label: dryv.field(p.String),
    value: dryv.field(p.Number),
    share: dryv.field(p.Number),
  }),
  PlaceStatisticsComparisonsPlace: dryv.schema({
    featureId: dryv.field(p.String),
    name: dryv.field(p.String),
    kindCode: dryv.field(p.String),
    kindLabel: dryv.field(p.String),
    path: dryv.field(p.String).optional(),
  }),
  PlaceStatisticsSiblingsPopulation: dryv.schema({
    position: dryv.field(p.Number),
    of: dryv.field(p.Number),
  }),
  PlaceStatisticsSiblingsDensity: dryv.schema({
    position: dryv.field(p.Number),
    of: dryv.field(p.Number),
  }),
  IndicatorSeriesIndicator: dryv.schema({
    code: dryv.field(p.String),
    name: dryv.field(p.String),
    unit: dryv.field(p.String),
    description: dryv.field(p.String),
    higherIsBetter: dryv.field(p.Flag).maybe().optional(),
  }),
  IndicatorSeriesPoints: dryv.schema({
    period: dryv.field(p.String),
    value: dryv.field(p.Number),
    estimated: dryv.field(p.Flag),
  }),
  IndicatorMapIndicator: dryv.schema({
    code: dryv.field(p.String),
    name: dryv.field(p.String),
    unit: dryv.field(p.String),
    higherIsBetter: dryv.field(p.Flag).maybe(),
  }),
  IndicatorMapUnits: dryv.schema({
    featureId: dryv.field(p.String),
    name: dryv.field(p.String),
    kind: dryv.field(p.String),
    value: dryv.field(p.Number),
    rank: dryv.field(p.Number),
    estimated: dryv.field(p.Flag),
    geometry: dryv.field(dryv.unknown()).maybe(),
    path: dryv.field(p.String),
  }),
  PlaceElectionsElectionsContestsCandidates: dryv.schema({
    name: dryv.field(p.String),
    party: dryv.field(p.String),
    partyCode: dryv.field(p.String),
    votes: dryv.field(p.Number),
    share: dryv.field(p.Number),
    won: dryv.field(p.Flag),
    individualId: dryv.field(p.String),
  }),
  PlaceElectionsRegistrationTrend: dryv.schema({
    period: dryv.field(p.String),
    value: dryv.field(p.Number),
    estimated: dryv.field(p.Flag),
  }),
  PlaceElectionsTurnoutTrend: dryv.schema({
    year: dryv.field(p.Number),
    registered: dryv.field(p.Number),
    turnout: dryv.field(p.Number),
  }),
  ElectionListElectionsWinner: dryv.schema({
    name: dryv.field(p.String),
    party: dryv.field(p.String),
    votes: dryv.field(p.Number),
  }),
  ElectionListElectionsRunnerUp: dryv.schema({
    name: dryv.field(p.String),
    party: dryv.field(p.String),
    votes: dryv.field(p.Number),
  }),
  ElectionDetailElection: dryv.schema({
    electionId: dryv.field(p.String),
    code: dryv.field(p.String),
    year: dryv.field(p.Number),
    heldOn: dryv.field(p.String),
    contestKind: dryv.field(p.String).optional(),
  }),
  ElectionDetailContests: dryv.schema({
    kind: dryv.field(p.String),
    contests: dryv.field(p.Number),
  }),
  ElectionDetailTotals: dryv.schema({
    name: dryv.field(p.String),
    party: dryv.field(p.String),
    partyCode: dryv.field(p.String),
    votes: dryv.field(p.Number),
    share: dryv.field(p.Number),
  }),
  ElectionDetailUnitsWinner: dryv.schema({
    name: dryv.field(p.String),
    party: dryv.field(p.String),
    partyCode: dryv.field(p.String),
    votes: dryv.field(p.Number),
    share: dryv.field(p.Number),
    margin: dryv.field(p.Number),
  }),
  ElectionDetailUnitsCandidates: dryv.schema({
    name: dryv.field(p.String),
    party: dryv.field(p.String),
    partyCode: dryv.field(p.String),
    votes: dryv.field(p.Number),
    share: dryv.field(p.Number),
  }),
  PartyListParties: dryv.schema({
    code: dryv.field(p.String),
    name: dryv.field(p.String),
    members: dryv.field(p.Number),
    votes2022: dryv.field(p.Number),
    officeHolders: dryv.field(p.Number),
    fundAllocationKes: dryv.field(p.Number).maybe(),
  }),
  PartyDetailParty: dryv.schema({
    code: dryv.field(p.String),
    name: dryv.field(p.String),
    registeredOn: dryv.field(p.String).maybe(),
    media: dryv.field(dryv.unknown()).array(),
  }),
  PartyDetailMembers: dryv.schema({
    holderId: dryv.field(p.String).maybe(),
    individualId: dryv.field(p.String),
    name: dryv.field(p.String),
    office: dryv.field(p.String).maybe(),
    unit: dryv.field(p.String).maybe(),
    unitId: dryv.field(p.String).maybe(),
    leaderSlug: dryv.field(p.String).optional(),
    unitPath: dryv.field(p.String).optional(),
  }),
  PartyDetailResults: dryv.schema({
    year: dryv.field(p.Number),
    contest: dryv.field(p.String),
    votes: dryv.field(p.Number),
    candidates: dryv.field(p.Number),
    won: dryv.field(p.Number),
  }),
  PartyDetailFunding: dryv.schema({
    year: dryv.field(p.Number),
    amountKes: dryv.field(p.Number),
  }),
  MotionListMotions: dryv.schema({
    code: dryv.field(p.String),
    title: dryv.field(p.String),
    summary: dryv.field(p.String),
    held_on: dryv.field(p.String),
    institution: dryv.field(p.String),
    institution_id: dryv.field(p.String),
    kind: dryv.field(p.String),
    outcome: dryv.field(p.String),
    yes: dryv.field(p.Number),
    no: dryv.field(p.Number),
    abstain: dryv.field(p.Number),
    absent: dryv.field(p.Number),
  }),
  MotionDetailMotionContributions: dryv.schema({
    summary: dryv.field(p.String),
    word_count: dryv.field(p.Number),
    kind: dryv.field(p.String),
    holder_id: dryv.field(p.String),
    name: dryv.field(p.String),
    party: dryv.field(p.String).maybe(),
  }),
  MotionDetailTally: dryv.schema({
    yes: dryv.field(p.Number),
    no: dryv.field(p.Number),
    abstain: dryv.field(p.Number),
    absent: dryv.field(p.Number),
    total: dryv.field(p.Number),
    passed: dryv.field(p.Flag),
  }),
  MotionDetailParties: dryv.schema({
    party: dryv.field(p.String),
    yes: dryv.field(p.Number),
    no: dryv.field(p.Number),
    abstain: dryv.field(p.Number),
    absent: dryv.field(p.Number),
  }),
  MotionDetailMembers: dryv.schema({
    holderId: dryv.field(p.String),
    individualId: dryv.field(p.String),
    name: dryv.field(p.String),
    party: dryv.field(p.String).maybe(),
    partyCode: dryv.field(p.String).maybe(),
    position: dryv.field(p.String),
    unit: dryv.field(p.String).maybe(),
    office: dryv.field(p.String),
    leaderSlug: dryv.field(p.String),
  }),
  MotionDetailLegalProvision: dryv.schema({
    designation: dryv.field(p.String),
    title: dryv.field(p.String),
    instrument: dryv.field(p.String),
  }),
  MotionDetailLegalFiscalYear: dryv.schema({
    code: dryv.field(p.String),
    starts_on: dryv.field(p.String),
    ends_on: dryv.field(p.String),
  }),
  LeaderProfileLeader: dryv.schema({
    holderId: dryv.field(p.String),
    individualId: dryv.field(p.String),
    name: dryv.field(p.String),
    party: dryv.field(p.String).maybe(),
    office: dryv.field(p.String),
    unitId: dryv.field(p.String).maybe(),
    unit: dryv.field(p.String).maybe(),
    institution: dryv.field(p.String),
    tookOfficeOn: dryv.field(p.String),
    birthDate: dryv.field(p.String),
    leaderSlug: dryv.field(p.String),
    unitPath: dryv.field(p.String).optional(),
  }),
  LeaderProfileOffices: dryv.schema({
    holderId: dryv.field(p.String),
    office: dryv.field(p.String),
    unit: dryv.field(p.String).maybe(),
    tookOfficeOn: dryv.field(p.String),
    leftOfficeOn: dryv.field(p.String).maybe(),
    leaderSlug: dryv.field(p.String),
  }),
  LeaderProfileContacts: dryv.schema({
    kind: dryv.field(p.String),
    value: dryv.field(p.String),
    visibility: dryv.field(p.String),
    scope: dryv.field(p.String),
  }),
  LeaderProfileMedia: dryv.schema({
    kind: dryv.field(p.String),
    title: dryv.field(p.String),
    url: dryv.field(p.String),
    thumbnailUrl: dryv.field(p.String).maybe(),
    platform: dryv.field(p.String),
    embedUrl: dryv.field(p.String).maybe(),
    mimeType: dryv.field(p.String).maybe(),
    stored: dryv.field(p.Flag),
  }),
  LeaderProfileActivityVotes: dryv.schema({
    yes: dryv.field(p.Number),
    no: dryv.field(p.Number),
    abstain: dryv.field(p.Number),
    absent: dryv.field(p.Number),
    total: dryv.field(p.Number),
    attendance: dryv.field(p.Number).maybe(),
  }),
  LeaderProfileActivityContributions: dryv.schema({
    count: dryv.field(p.Number),
    words: dryv.field(p.Number),
  }),
  LeaderProfileActivityRecent: dryv.schema({
    code: dryv.field(p.String),
    title: dryv.field(p.String),
    held_on: dryv.field(p.String),
    position: dryv.field(p.String),
    outcome: dryv.field(p.String),
  }),
  LeaderProfileActivitySpeeches: dryv.schema({
    motion_code: dryv.field(p.String),
    motion: dryv.field(p.String),
    held_on: dryv.field(p.String),
    kind: dryv.field(p.String),
    summary: dryv.field(p.String),
    word_count: dryv.field(p.Number),
  }),
  LeaderProfileElection: dryv.schema({
    year: dryv.field(p.Number),
    heldOn: dryv.field(p.String),
    votes: dryv.field(p.Number),
    total: dryv.field(p.Number),
    runner_up: dryv.field(p.Number),
    registered: dryv.field(p.Number),
    candidates: dryv.field(p.Number),
    share: dryv.field(p.Number),
    margin: dryv.field(p.Number),
  }),
  LeaderProfileEvidence: dryv.schema({
    citationId: dryv.field(p.String),
    sourceName: dryv.field(p.String),
    publisherName: dryv.field(p.String).maybe(),
    artifactTitle: dryv.field(p.String),
    locator: dryv.field(p.String),
    retrievedAt: dryv.field(p.String),
    verification: dryv.field(p.String).maybe(),
    confidence: dryv.field(p.Number).maybe(),
  }),
  PlaceCivicFund: dryv.schema({
    code: dryv.field(p.String),
    managedBy: dryv.field(p.String),
    funds: dryv.field(p.Number),
  }),
  PlaceCivicYearsClasses: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
    amount: dryv.field(p.Number),
    lines: dryv.field(p.Number),
  }),
  PlaceCivicClasses: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
    amount: dryv.field(p.Number),
  }),
  PlaceCivicProjectsMedia: dryv.schema({
    kind: dryv.field(p.String),
    title: dryv.field(p.String),
    url: dryv.field(p.String),
    thumbnailUrl: dryv.field(p.String).maybe(),
    platform: dryv.field(p.String),
    embedUrl: dryv.field(p.String).maybe(),
    mimeType: dryv.field(p.String).maybe(),
    stored: dryv.field(p.Flag),
  }),
  PlaceCivicInfrastructure: dryv.schema({
    projects: dryv.field(p.Number),
    completed: dryv.field(p.Number),
    completionRate: dryv.field(p.Number).maybe(),
    areaKm2: dryv.field(p.Number).maybe(),
    population: dryv.field(p.Number).maybe(),
    perKm2: dryv.field(p.Number).maybe(),
    per100k: dryv.field(p.Number).maybe(),
    staffShare: dryv.field(p.Number).maybe(),
    projectShare: dryv.field(p.Number).maybe(),
  }),
  PlaceCivicLeadershipEvidence: dryv.schema({
    citationId: dryv.field(p.String),
    sourceName: dryv.field(p.String),
    publisherName: dryv.field(p.String).maybe(),
    artifactTitle: dryv.field(p.String),
    locator: dryv.field(p.String),
    retrievedAt: dryv.field(p.String),
    verification: dryv.field(p.String).maybe(),
    confidence: dryv.field(p.Number).maybe(),
  }),
  ProjectDetailProject: dryv.schema({
    code: dryv.field(p.String),
    name: dryv.field(p.String),
    description: dryv.field(p.String),
    status: dryv.field(p.String),
    started_on: dryv.field(p.String),
    completed_on: dryv.field(p.String).maybe(),
    unit_id: dryv.field(p.String),
    unit: dryv.field(p.String),
    responsible: dryv.field(p.String).maybe(),
    location: dryv.field(dryv.unknown()),
    unit_path: dryv.field(p.String),
  }),
  ProjectDetailProcurementBids: dryv.schema({
    bidder: dryv.field(p.String),
    amount: dryv.field(p.Number),
    outcome: dryv.field(p.String),
  }),
  ProjectDetailProcurementContracts: dryv.schema({
    contractor: dryv.field(p.String),
    amount: dryv.field(p.Number),
    signed_on: dryv.field(p.String),
    status: dryv.field(p.String),
  }),
  ProjectDetailMedia: dryv.schema({
    kind: dryv.field(p.String),
    title: dryv.field(p.String),
    url: dryv.field(p.String),
    thumbnailUrl: dryv.field(p.String).maybe(),
    platform: dryv.field(p.String),
    embedUrl: dryv.field(p.String).maybe(),
    mimeType: dryv.field(p.String).maybe(),
    stored: dryv.field(p.Flag),
  }),
  ProjectDetailEvidence: dryv.schema({
    citationId: dryv.field(p.String),
    sourceName: dryv.field(p.String),
    publisherName: dryv.field(p.String).maybe(),
    artifactTitle: dryv.field(p.String),
    locator: dryv.field(p.String),
    retrievedAt: dryv.field(p.String),
    verification: dryv.field(p.String).maybe(),
    confidence: dryv.field(p.Number).maybe(),
  }),
  LeaderTreeLevelsUnit: dryv.schema({
    featureId: dryv.field(p.String),
    name: dryv.field(p.String),
    kindCode: dryv.field(p.String),
    kindLabel: dryv.field(p.String),
    path: dryv.field(p.String).optional(),
  }),
  InstitutionListArmsGroupsKind: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
  }),
  InstitutionListArmsGroupsInstitutionsKind: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
  }),
  InstitutionListArmsGroupsInstitutionsArm: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
  }),
  InstitutionListArmsGroupsInstitutionsBasis: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
  }),
  InstitutionListArmsGroupsInstitutionsParent: dryv.schema({
    code: dryv.field(p.String),
    name: dryv.field(p.String),
  }),
  InstitutionDetailInstitutionKind: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
  }),
  InstitutionDetailInstitutionArm: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
  }),
  InstitutionDetailInstitutionBasis: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
  }),
  InstitutionDetailInstitutionParent: dryv.schema({
    code: dryv.field(p.String),
    name: dryv.field(p.String),
  }),
  InstitutionDetailLeadersTier: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
    parent: dryv.field(p.String).maybe(),
  }),
  InstitutionDetailLeadersHow: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
  }),
  InstitutionDetailLeadersUnit: dryv.schema({
    featureId: dryv.field(p.String),
    name: dryv.field(p.String),
  }),
  InstitutionDetailLegalBasis: dryv.schema({
    type: dryv.field(p.String),
    effect: dryv.field(p.String),
    effectCode: dryv.field(p.String).optional(),
    provisionCode: dryv.field(p.String).maybe(),
    designation: dryv.field(p.String),
    heading: dryv.field(p.String).maybe(),
    instrument: dryv.field(p.String),
    instrumentCode: dryv.field(p.String).maybe(),
    excerpt: dryv.field(p.String),
    explanation: dryv.field(p.String).optional(),
    reviewStatus: dryv.field(p.String),
    via: dryv.field(p.String).maybe().optional(),
  }),
  InstitutionDetailContentCategory: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
  }),
  InstitutionDetailContentClassification: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
  }),
  InstitutionDetailContentFrontMatter: dryv.schema({
    image: dryv.field(p.String),
  }),
  InstitutionDetailContentSubject: dryv.schema({
    table: dryv.field(p.String),
    code: dryv.field(p.String),
  }),
  InstitutionDetailParentsRelation: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
  }),
  InstitutionDetailChildrenRelation: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
  }),
  InstitutionDetailMetrics: dryv.schema({
    label: dryv.field(p.String),
    value: dryv.field(p.Number),
  }),
  GovernanceTabsTabs: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
    about: dryv.field(p.String),
    kind: dryv.field(p.String),
    count: dryv.field(p.Number),
    includes: dryv.field(p.String).array(),
  }),
  GovernanceTabsArmsInstitutionsKind: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
  }),
  GovernanceTreeTab: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
    about: dryv.field(p.String),
    institution: dryv.field(p.String).maybe(),
  }),
  GovernanceTreeNodesRefs: dryv.schema({
    scheme: dryv.field(p.String),
    value: dryv.field(p.String).optional(),
    table: dryv.field(p.String).optional(),
    code: dryv.field(p.String).optional(),
    basis: dryv.field(p.String).optional(),
    office: dryv.field(p.String).optional(),
    tier: dryv.field(p.String).optional(),
    appointment: dryv.field(p.String).optional(),
    institution: dryv.field(p.String).optional(),
  }),
  GovernanceTreeNodesTier: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
    position: dryv.field(p.Number).maybe(),
  }),
  GovernanceTreeNodesHow: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
  }),
  GovernanceTreeNodesUnit: dryv.schema({
    featureId: dryv.field(p.String),
    name: dryv.field(p.String),
    path: dryv.field(p.String).optional(),
  }),
  GovernanceTreeNodesBody: dryv.schema({
    code: dryv.field(p.String),
    name: dryv.field(p.String),
  }),
  GovernanceTreeNodesPerformance: dryv.schema({
    score: dryv.field(p.Number),
    basis: dryv.field(p.String),
    rank: dryv.field(p.Number),
    of: dryv.field(p.Number),
    samples: dryv.field(p.Number),
    text: dryv.field(p.String),
  }),
  GovernanceTreeEdges: dryv.schema({
    from: dryv.field(p.String),
    to: dryv.field(p.String),
    kind: dryv.field(p.String),
  }),
  GovernanceTreeRailUnit: dryv.schema({
    featureId: dryv.field(p.String),
    name: dryv.field(p.String),
    kindCode: dryv.field(p.String),
    kindLabel: dryv.field(p.String),
    path: dryv.field(p.String).optional(),
  }),
  GovernanceTreeRailRefs: dryv.schema({
    table: dryv.field(p.String),
    code: dryv.field(p.String),
    kind: dryv.field(p.String),
  }),
  GovernanceTreeLegend: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
  }),
  ContentPageContentCategory: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
  }),
  ContentPageContentFrontMatter: dryv.schema({
    citationId: dryv.field(p.String),
  }),
  ContentPageContentSubject: dryv.schema({
    table: dryv.field(p.String),
    code: dryv.field(p.String),
  }),
  ContentPageRelatedCategory: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
  }),
  ContentPageRelatedFrontMatter: dryv.schema({
    parent: dryv.field(p.String),
    citationId: dryv.field(p.String),
  }),
  ContentPageRelatedSubject: dryv.schema({
    table: dryv.field(p.String),
    code: dryv.field(p.String),
  }),
  ContentListItemsCategory: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
  }),
  ContentListItemsClassification: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
  }),
  ContentListItemsFrontMatter: dryv.schema({
    image: dryv.field(p.String).optional(),
  }),
  ContentListItemsSubject: dryv.schema({
    table: dryv.field(p.String),
    code: dryv.field(p.String).maybe(),
  }),
  ContentListCategories: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
    count: dryv.field(p.Number),
  }),
  LegalBasisSubject: dryv.schema({
    table: dryv.field(p.String),
    code: dryv.field(p.String),
  }),
  LegalBasisItems: dryv.schema({
    effect: dryv.field(p.String),
    effectCode: dryv.field(p.String),
    provisionCode: dryv.field(p.String),
    designation: dryv.field(p.String),
    heading: dryv.field(p.String).maybe(),
    instrument: dryv.field(p.String),
    instrumentCode: dryv.field(p.String),
    excerpt: dryv.field(p.String),
    explanation: dryv.field(p.String),
    reviewStatus: dryv.field(p.String),
    via: dryv.field(p.String).maybe(),
  }),
  CompareOptionsPlace: dryv.schema({
    featureId: dryv.field(p.String),
    name: dryv.field(p.String),
    kindCode: dryv.field(p.String),
    kindLabel: dryv.field(p.String),
    path: dryv.field(p.String),
  }),
  CompareOptionsNearby: dryv.schema({
    featureId: dryv.field(p.String),
    name: dryv.field(p.String),
    kindLabel: dryv.field(p.String),
    distanceKm: dryv.field(p.Number),
    path: dryv.field(p.String),
  }),
  CompareOptionsTop: dryv.schema({
    rank: dryv.field(p.Number),
    featureId: dryv.field(p.String),
    subjectId: dryv.field(p.String).maybe(),
    name: dryv.field(p.String),
    detail: dryv.field(p.String),
    value: dryv.field(p.Number),
    share: dryv.field(p.Number),
    path: dryv.field(p.String),
  }),
  CompareOptionsHierarchyUnit: dryv.schema({
    featureId: dryv.field(p.String),
    name: dryv.field(p.String),
    kindCode: dryv.field(p.String),
    kindLabel: dryv.field(p.String),
    path: dryv.field(p.String).optional(),
  }),
  CompareOptionsMetrics: dryv.schema({
    code: dryv.field(p.String),
    title: dryv.field(p.String),
    domain: dryv.field(p.String),
    unit: dryv.field(p.String),
    higherIsBetter: dryv.field(p.Flag),
    describe: dryv.field(p.String),
  }),
  ComparisonA: dryv.schema({
    featureId: dryv.field(p.String),
    name: dryv.field(p.String),
    kindCode: dryv.field(p.String),
    kindLabel: dryv.field(p.String),
    path: dryv.field(p.String),
  }),
  ComparisonB: dryv.schema({
    featureId: dryv.field(p.String),
    name: dryv.field(p.String),
    kindCode: dryv.field(p.String),
    kindLabel: dryv.field(p.String),
    path: dryv.field(p.String),
  }),
  ComparisonRows: dryv.schema({
    code: dryv.field(p.String),
    title: dryv.field(p.String),
    unit: dryv.field(p.String),
    higherIsBetter: dryv.field(p.Flag),
    a: dryv.field(p.Number),
    b: dryv.field(p.Number),
    diffPercent: dryv.field(p.Number).maybe(),
  }),
  NearbyProjectsProjectsMedia: dryv.schema({
    kind: dryv.field(p.String),
    title: dryv.field(p.String),
    url: dryv.field(p.String),
    thumbnailUrl: dryv.field(p.String).maybe(),
    platform: dryv.field(p.String).maybe(),
    embedUrl: dryv.field(p.String).maybe(),
    mimeType: dryv.field(p.String).maybe(),
    stored: dryv.field(p.Flag),
  }),
  TenderListSummaryByStatus: dryv.schema({
    status: dryv.field(p.String),
    count: dryv.field(p.Number),
    valueKes: dryv.field(p.Number),
  }),
  TenderListSummaryTransparency: dryv.schema({
    withContract: dryv.field(p.Number),
    listed: dryv.field(p.Number),
  }),
  TenderListTenders: dryv.schema({
    code: dryv.field(p.String),
    title: dryv.field(p.String),
    reference: dryv.field(p.String).maybe(),
    status: dryv.field(p.String),
    procedure: dryv.field(p.String),
    published_on: dryv.field(p.String),
    closes_on: dryv.field(p.String),
    awarded_on: dryv.field(p.String).maybe(),
    buyer: dryv.field(p.String),
    place: dryv.field(p.String).maybe(),
    amount: dryv.field(p.Number).maybe(),
    supplier: dryv.field(p.String).maybe(),
    bids: dryv.field(p.Number),
    disclosed: dryv.field(p.Number),
    disclosedOf: dryv.field(p.Number),
  }),
});

const sections1 = insights.schemas({
  PlaceStatisticsTopicsIndicators: dryv.schema({
    code: dryv.field(p.String),
    /** The part the indicator plays on the screens (population, density, area); the screens ask for a role, never a code. */
    role: dryv.field(p.String).maybe(),
    name: dryv.field(p.String),
    unit: dryv.field(p.String),
    measure: dryv.field(p.String),
    higherIsBetter: dryv.field(p.Flag).maybe(),
    latest: dryv.field(sections0.PlaceStatisticsTopicsIndicatorsLatest),
    previous: dryv.field(sections0.PlaceStatisticsTopicsIndicatorsPrevious).maybe(),
    change: dryv.field(p.Number).maybe(),
    series: dryv.field(sections0.PlaceStatisticsTopicsIndicatorsSeries).array(),
  }),
  PlaceStatisticsBreakdowns: dryv.schema({
    age: dryv.field(sections0.PlaceStatisticsBreakdownsAge).array().optional(),
    community: dryv.field(sections0.PlaceStatisticsBreakdownsCommunity).array().optional(),
    language: dryv.field(sections0.PlaceStatisticsBreakdownsLanguage).array().optional(),
    residence: dryv.field(sections0.PlaceStatisticsBreakdownsResidence).array().optional(),
    sex: dryv.field(sections0.PlaceStatisticsBreakdownsSex).array().optional(),
  }),
  PlaceStatisticsComparisons: dryv.schema({
    place: dryv.field(sections0.PlaceStatisticsComparisonsPlace),
    population: dryv.field(p.Number).maybe(),
    areaKm2: dryv.field(p.Number).maybe(),
    density: dryv.field(p.Number).maybe(),
  }),
  PlaceStatisticsSiblings: dryv.schema({
    population: dryv.field(sections0.PlaceStatisticsSiblingsPopulation).maybe(),
    density: dryv.field(sections0.PlaceStatisticsSiblingsDensity).maybe(),
    peers: dryv.field(p.Number),
  }),
  PlaceElectionsElectionsContests: dryv.schema({
    kind: dryv.field(p.String),
    registered: dryv.field(p.Number),
    ballotsCast: dryv.field(p.Number),
    turnout: dryv.field(p.Number),
    candidates: dryv.field(sections0.PlaceElectionsElectionsContestsCandidates).array(),
  }),
  ElectionListElections: dryv.schema({
    electionId: dryv.field(p.String),
    code: dryv.field(p.String),
    year: dryv.field(p.Number),
    heldOn: dryv.field(p.String),
    kind: dryv.field(p.String),
    contests: dryv.field(p.Number),
    registeredVoters: dryv.field(p.Number).maybe(),
    validVotes: dryv.field(p.Number).maybe(),
    winner: dryv.field(sections0.ElectionListElectionsWinner).maybe(),
    runnerUp: dryv.field(sections0.ElectionListElectionsRunnerUp).maybe(),
  }),
  ElectionDetailUnits: dryv.schema({
    featureId: dryv.field(p.String),
    name: dryv.field(p.String),
    geometry: dryv.field(dryv.unknown()).maybe(),
    registered: dryv.field(p.Number),
    ballotsCast: dryv.field(p.Number),
    validVotes: dryv.field(p.Number),
    rejected: dryv.field(p.Number),
    turnout: dryv.field(p.Number),
    winner: dryv.field(sections0.ElectionDetailUnitsWinner),
    candidates: dryv.field(sections0.ElectionDetailUnitsCandidates).array(),
    path: dryv.field(p.String),
  }),
  MotionDetailMotion: dryv.schema({
    code: dryv.field(p.String),
    title: dryv.field(p.String),
    summary: dryv.field(p.String),
    held_on: dryv.field(p.String),
    sitting: dryv.field(p.String),
    institution_id: dryv.field(p.String),
    institution: dryv.field(p.String),
    kind: dryv.field(p.String),
    outcome: dryv.field(p.String),
    moved_by: dryv.field(p.String),
    contributions: dryv.field(sections0.MotionDetailMotionContributions).array(),
  }),
  MotionDetailLegal: dryv.schema({
    provision: dryv.field(sections0.MotionDetailLegalProvision).maybe(),
    fiscalYear: dryv.field(sections0.MotionDetailLegalFiscalYear).maybe(),
  }),
  LeaderProfileActivity: dryv.schema({
    votes: dryv.field(sections0.LeaderProfileActivityVotes),
    contributions: dryv.field(sections0.LeaderProfileActivityContributions),
    recent: dryv.field(sections0.LeaderProfileActivityRecent).array(),
    speeches: dryv.field(sections0.LeaderProfileActivitySpeeches).array(),
    recorded: dryv.field(p.Flag),
  }),
  PlaceCivicYears: dryv.schema({
    year: dryv.field(p.Number),
    total: dryv.field(p.Number),
    classes: dryv.field(sections0.PlaceCivicYearsClasses).array(),
  }),
  PlaceCivicProjects: dryv.schema({
    code: dryv.field(p.String),
    name: dryv.field(p.String),
    status: dryv.field(p.String),
    started_on: dryv.field(p.String),
    completed_on: dryv.field(p.String).maybe(),
    unit: dryv.field(p.String),
    unit_id: dryv.field(p.String),
    location: dryv.field(dryv.unknown()).maybe(),
    amount: dryv.field(p.Number).maybe(),
    contractor: dryv.field(p.String).maybe(),
    media: dryv.field(sections0.PlaceCivicProjectsMedia),
    unit_path: dryv.field(p.String),
  }),
  PlaceCivicLeadership: dryv.schema({
    holderId: dryv.field(p.String),
    officeCode: dryv.field(p.String),
    officeTitle: dryv.field(p.String),
    unitFeatureId: dryv.field(p.String),
    unitName: dryv.field(p.String),
    personName: dryv.field(p.String),
    partyName: dryv.field(p.String).maybe(),
    tookOfficeOn: dryv.field(p.String),
    leftOfficeOn: dryv.field(p.String).maybe(),
    portrait: dryv.field(dryv.unknown()).maybe(),
    evidence: dryv.field(sections0.PlaceCivicLeadershipEvidence).array(),
    leaderSlug: dryv.field(p.String),
  }),
  ProjectDetailProcurement: dryv.schema({
    code: dryv.field(p.String),
    title: dryv.field(p.String).maybe(),
    reference: dryv.field(p.String).maybe(),
    status: dryv.field(p.String),
    procedure: dryv.field(p.String),
    published_on: dryv.field(p.String),
    closes_on: dryv.field(p.String),
    awarded_on: dryv.field(p.String).maybe(),
    buyer: dryv.field(p.String),
    bids: dryv.field(sections0.ProjectDetailProcurementBids).array(),
    contracts: dryv.field(sections0.ProjectDetailProcurementContracts).array(),
  }),
  LeaderTreeLevels: dryv.schema({
    level: dryv.field(p.String),
    label: dryv.field(p.String),
    unit: dryv.field(sections0.LeaderTreeLevelsUnit).maybe(),
    total: dryv.field(p.Number),
    groups: dryv.field(dryv.unknown()),
  }),
  InstitutionListArmsGroupsInstitutions: dryv.schema({
    code: dryv.field(p.String),
    name: dryv.field(p.String),
    kind: dryv.field(sections0.InstitutionListArmsGroupsInstitutionsKind),
    arm: dryv.field(sections0.InstitutionListArmsGroupsInstitutionsArm),
    basis: dryv.field(sections0.InstitutionListArmsGroupsInstitutionsBasis),
    parent: dryv.field(sections0.InstitutionListArmsGroupsInstitutionsParent).maybe(),
    leaders: dryv.field(p.Number),
    children: dryv.field(p.Number),
    purpose: dryv.field(p.String),
    image: dryv.field(p.String).maybe(),
  }),
  InstitutionDetailInstitution: dryv.schema({
    code: dryv.field(p.String),
    name: dryv.field(p.String),
    kind: dryv.field(sections0.InstitutionDetailInstitutionKind),
    arm: dryv.field(sections0.InstitutionDetailInstitutionArm),
    basis: dryv.field(sections0.InstitutionDetailInstitutionBasis),
    parent: dryv.field(sections0.InstitutionDetailInstitutionParent).maybe(),
    leaders: dryv.field(p.Number),
    children: dryv.field(p.Number),
    purpose: dryv.field(p.String),
    image: dryv.field(p.String).maybe(),
    established: dryv.field(p.String).maybe(),
    functions: dryv.field(p.String).array(),
  }),
  InstitutionDetailLeaders: dryv.schema({
    holderId: dryv.field(p.String),
    name: dryv.field(p.String),
    party: dryv.field(p.String).maybe(),
    tier: dryv.field(sections0.InstitutionDetailLeadersTier),
    how: dryv.field(sections0.InstitutionDetailLeadersHow),
    unit: dryv.field(sections0.InstitutionDetailLeadersUnit).maybe(),
    since: dryv.field(p.String),
    photo: dryv.field(p.String),
    officeCode: dryv.field(p.String),
    leaderSlug: dryv.field(p.String),
  }),
  InstitutionDetailContent: dryv.schema({
    code: dryv.field(p.String),
    slug: dryv.field(p.String),
    language: dryv.field(p.String),
    title: dryv.field(p.String),
    summary: dryv.field(p.String),
    category: dryv.field(sections0.InstitutionDetailContentCategory),
    classification: dryv.field(sections0.InstitutionDetailContentClassification),
    body: dryv.field(p.String),
    image: dryv.field(p.String),
    frontMatter: dryv.field(sections0.InstitutionDetailContentFrontMatter),
    tags: dryv.field(p.String).array(),
    isDevelopmentText: dryv.field(p.Flag),
    subject: dryv.field(sections0.InstitutionDetailContentSubject),
    unresolvedMedia: dryv.field(p.String).array(),
  }),
  InstitutionDetailParents: dryv.schema({
    code: dryv.field(p.String),
    name: dryv.field(p.String),
    relation: dryv.field(sections0.InstitutionDetailParentsRelation),
    children: dryv.field(p.Number),
  }),
  InstitutionDetailChildren: dryv.schema({
    code: dryv.field(p.String),
    name: dryv.field(p.String),
    relation: dryv.field(sections0.InstitutionDetailChildrenRelation),
    children: dryv.field(p.Number),
  }),
  GovernanceTabsArmsInstitutions: dryv.schema({
    code: dryv.field(p.String),
    name: dryv.field(p.String),
    leaders: dryv.field(p.Number),
    kind: dryv.field(sections0.GovernanceTabsArmsInstitutionsKind),
    image: dryv.field(p.String).maybe(),
  }),
  GovernanceTreeNodes: dryv.schema({
    id: dryv.field(p.String),
    type: dryv.field(p.String),
    name: dryv.field(p.String),
    level: dryv.field(p.String),
    refs: dryv.field(sections0.GovernanceTreeNodesRefs),
    purpose: dryv.field(p.String).maybe().optional(),
    kind: dryv.field(p.String).optional(),
    arm: dryv.field(p.String).optional(),
    basis: dryv.field(p.String).optional(),
    leaders: dryv.field(p.Number).optional(),
    code: dryv.field(p.String).optional(),
    holderId: dryv.field(p.String).optional(),
    party: dryv.field(p.String).maybe().optional(),
    photo: dryv.field(p.String).optional(),
    since: dryv.field(p.String).optional(),
    tier: dryv.field(sections0.GovernanceTreeNodesTier).optional(),
    how: dryv.field(sections0.GovernanceTreeNodesHow).optional(),
    unit: dryv.field(sections0.GovernanceTreeNodesUnit).optional(),
    body: dryv.field(sections0.GovernanceTreeNodesBody).optional(),
    performance: dryv.field(sections0.GovernanceTreeNodesPerformance).maybe().optional(),
    leaderSlug: dryv.field(p.String).optional(),
  }),
  GovernanceTreeRail: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
    about: dryv.field(p.String),
    count: dryv.field(p.Number),
    unit: dryv.field(sections0.GovernanceTreeRailUnit).maybe(),
    refs: dryv.field(sections0.GovernanceTreeRailRefs),
  }),
  ContentPageContent: dryv.schema({
    code: dryv.field(p.String),
    slug: dryv.field(p.String),
    language: dryv.field(p.String),
    title: dryv.field(p.String),
    summary: dryv.field(p.String),
    category: dryv.field(sections0.ContentPageContentCategory),
    classification: dryv.field(sections0.InstitutionDetailContentClassification).maybe(),
    body: dryv.field(p.String),
    image: dryv.field(p.String).maybe(),
    frontMatter: dryv.field(sections0.ContentPageContentFrontMatter),
    tags: dryv.field(p.String).array(),
    isDevelopmentText: dryv.field(p.Flag),
    subject: dryv.field(sections0.ContentPageContentSubject),
    unresolvedMedia: dryv.field(p.String).array(),
  }),
  ContentPageRelated: dryv.schema({
    code: dryv.field(p.String),
    slug: dryv.field(p.String),
    language: dryv.field(p.String),
    title: dryv.field(p.String),
    summary: dryv.field(p.String),
    category: dryv.field(sections0.ContentPageRelatedCategory),
    classification: dryv.field(sections0.InstitutionDetailContentClassification).maybe(),
    body: dryv.field(p.String),
    image: dryv.field(p.String).maybe(),
    frontMatter: dryv.field(sections0.ContentPageRelatedFrontMatter),
    tags: dryv.field(p.String).array(),
    isDevelopmentText: dryv.field(p.Flag),
    subject: dryv.field(sections0.ContentPageRelatedSubject),
    unresolvedMedia: dryv.field(p.String).array(),
  }),
  ContentListItems: dryv.schema({
    code: dryv.field(p.String),
    slug: dryv.field(p.String),
    language: dryv.field(p.String),
    title: dryv.field(p.String),
    summary: dryv.field(p.String),
    category: dryv.field(sections0.ContentListItemsCategory),
    classification: dryv.field(sections0.ContentListItemsClassification),
    body: dryv.field(p.String),
    image: dryv.field(p.String).maybe(),
    frontMatter: dryv.field(sections0.ContentListItemsFrontMatter),
    tags: dryv.field(p.String).array(),
    isDevelopmentText: dryv.field(p.Flag),
    subject: dryv.field(sections0.ContentListItemsSubject),
    unresolvedMedia: dryv.field(p.String).array(),
  }),
  CompareOptionsHierarchy: dryv.schema({
    rung: dryv.field(p.String),
    label: dryv.field(p.String),
    available: dryv.field(p.Flag),
    unit: dryv.field(sections0.CompareOptionsHierarchyUnit).maybe(),
    message: dryv.field(p.String).maybe(),
  }),
  NearbyProjectsProjects: dryv.schema({
    code: dryv.field(p.String),
    name: dryv.field(p.String),
    status: dryv.field(p.String),
    unit: dryv.field(p.String),
    unit_id: dryv.field(p.String),
    distance_km: dryv.field(p.Number),
    location: dryv.field(dryv.unknown()),
    amount: dryv.field(p.Number).maybe(),
    contractor: dryv.field(p.String).maybe(),
    responsible: dryv.field(p.String).maybe(),
    media: dryv.field(sections0.NearbyProjectsProjectsMedia),
    unit_path: dryv.field(p.String),
  }),
  TenderListSummary: dryv.schema({
    total: dryv.field(p.Number),
    byStatus: dryv.field(sections0.TenderListSummaryByStatus).array(),
    transparency: dryv.field(sections0.TenderListSummaryTransparency),
  }),
});

const sections2 = insights.schemas({
  PlaceStatisticsTopics: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
    indicators: dryv.field(sections1.PlaceStatisticsTopicsIndicators).array(),
  }),
  PlaceElectionsElections: dryv.schema({
    electionId: dryv.field(p.String),
    kind: dryv.field(p.String),
    year: dryv.field(p.Number),
    heldOn: dryv.field(p.String),
    contests: dryv.field(sections1.PlaceElectionsElectionsContests).array(),
  }),
  InstitutionListArmsGroups: dryv.schema({
    kind: dryv.field(sections0.InstitutionListArmsGroupsKind),
    institutions: dryv.field(sections1.InstitutionListArmsGroupsInstitutions).array(),
  }),
  GovernanceTabsArms: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
    about: dryv.field(p.String),
    institutions: dryv.field(sections1.GovernanceTabsArmsInstitutions).array(),
  }),
});

const sections3 = insights.schemas({
  InstitutionListArms: dryv.schema({
    code: dryv.field(p.String),
    label: dryv.field(p.String),
    about: dryv.field(p.String),
    count: dryv.field(p.Number),
    groups: dryv.field(sections2.InstitutionListArmsGroups).array(),
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
    media: dryv.field(sections0.PlaceBrowseMedia).array(),
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
    topics: dryv.field(sections2.PlaceStatisticsTopics).array(),
    breakdowns: dryv.field(sections1.PlaceStatisticsBreakdowns),
    comparisons: dryv.field(sections1.PlaceStatisticsComparisons).array(),
    siblings: dryv.field(sections1.PlaceStatisticsSiblings),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  IndicatorSeries: dryv.schema({
    indicator: dryv.field(sections0.IndicatorSeriesIndicator),
    place: dryv.field(shapes.PlaceCrumb),
    points: dryv.field(sections0.IndicatorSeriesPoints).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  /** One value per child unit, for a choropleth, with each unit's outline id. */
  IndicatorMap: dryv.schema({
    indicator: dryv.field(sections0.IndicatorMapIndicator),
    parent: dryv.field(shapes.PlaceCrumb).maybe(),
    periodFrom: dryv.field(p.CalendarDate).maybe(),
    units: dryv.field(sections0.IndicatorMapUnits).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  PlaceElections: dryv.schema({
    place: dryv.field(shapes.PlaceCrumb),
    elections: dryv.field(sections2.PlaceElectionsElections).array(),
    registrationTrend: dryv.field(sections0.PlaceElectionsRegistrationTrend).array(),
    turnoutTrend: dryv.field(sections0.PlaceElectionsTurnoutTrend).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  ElectionList: dryv.schema({ elections: dryv.field(sections1.ElectionListElections).array() }),
  ElectionDetail: dryv.schema({
    election: dryv.field(sections0.ElectionDetailElection),
    contests: dryv.field(sections0.ElectionDetailContests).array(),
    totals: dryv.field(sections0.ElectionDetailTotals).array(),
    units: dryv.field(sections1.ElectionDetailUnits).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  PartyList: dryv.schema({ parties: dryv.field(sections0.PartyListParties).array(), gaps: dryv.field(p.NonEmptyString500).array() }),
  PartyDetail: dryv.schema({
    party: dryv.field(sections0.PartyDetailParty),
    members: dryv.field(sections0.PartyDetailMembers).array(),
    results: dryv.field(sections0.PartyDetailResults).array(),
    funding: dryv.field(sections0.PartyDetailFunding).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  LawList: dryv.schema({
    instruments: dryv.field(shapes.LawInstrument).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  MotionList: dryv.schema({ motions: dryv.field(sections0.MotionListMotions).array() }),
  /** One motion with every member's position, for a hemicycle ("round table") of dots. */
  MotionDetail: dryv.schema({
    motion: dryv.field(sections1.MotionDetailMotion),
    tally: dryv.field(sections0.MotionDetailTally),
    parties: dryv.field(sections0.MotionDetailParties).array(),
    members: dryv.field(sections0.MotionDetailMembers).array(),
    legal: dryv.field(sections1.MotionDetailLegal),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  LeaderProfile: dryv.schema({
    leader: dryv.field(sections0.LeaderProfileLeader),
    offices: dryv.field(sections0.LeaderProfileOffices).array(),
    contacts: dryv.field(sections0.LeaderProfileContacts).array(),
    media: dryv.field(sections0.LeaderProfileMedia).array(),
    activity: dryv.field(sections1.LeaderProfileActivity),
    election: dryv.field(sections0.LeaderProfileElection).array(),
    fund: dryv.field(dryv.unknown()),
    evidence: dryv.field(sections0.LeaderProfileEvidence).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  PlaceCivic: dryv.schema({
    place: dryv.field(shapes.PlaceCrumb),
    chain: dryv.field(shapes.PlaceCrumb).array(),
    fund: dryv.field(sections0.PlaceCivicFund),
    years: dryv.field(sections1.PlaceCivicYears).array(),
    classes: dryv.field(sections0.PlaceCivicClasses).array(),
    projects: dryv.field(sections1.PlaceCivicProjects).array(),
    infrastructure: dryv.field(sections0.PlaceCivicInfrastructure),
    leadership: dryv.field(sections1.PlaceCivicLeadership).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  ProjectDetail: dryv.schema({
    project: dryv.field(sections0.ProjectDetailProject),
    money: dryv.field(dryv.unknown()).array(),
    procurement: dryv.field(sections1.ProjectDetailProcurement),
    media: dryv.field(sections0.ProjectDetailMedia).array(),
    evidence: dryv.field(sections0.ProjectDetailEvidence).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  LeaderTree: dryv.schema({
    place: dryv.field(shapes.PlaceCrumb).maybe(),
    levels: dryv.field(sections1.LeaderTreeLevels).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  InstitutionList: dryv.schema({
    arms: dryv.field(sections3.InstitutionListArms).array(),
    total: dryv.field(p.NonNegativeInteger),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  InstitutionDetail: dryv.schema({
    institution: dryv.field(sections1.InstitutionDetailInstitution),
    leaders: dryv.field(sections1.InstitutionDetailLeaders).array(),
    legalBasis: dryv.field(sections0.InstitutionDetailLegalBasis).array(),
    content: dryv.field(sections1.InstitutionDetailContent).array(),
    parents: dryv.field(sections1.InstitutionDetailParents).array(),
    children: dryv.field(sections1.InstitutionDetailChildren).array(),
    metrics: dryv.field(sections0.InstitutionDetailMetrics).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  GovernanceTabs: dryv.schema({
    tabs: dryv.field(sections0.GovernanceTabsTabs).array(),
    arms: dryv.field(sections2.GovernanceTabsArms).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  GovernanceTree: dryv.schema({
    tab: dryv.field(sections0.GovernanceTreeTab).maybe(),
    place: dryv.field(shapes.PlaceCrumb).maybe(),
    nodes: dryv.field(sections1.GovernanceTreeNodes).array(),
    edges: dryv.field(sections0.GovernanceTreeEdges).array(),
    rail: dryv.field(sections1.GovernanceTreeRail).array(),
    legend: dryv.field(sections0.GovernanceTreeLegend).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  ContentPage: dryv.schema({
    content: dryv.field(sections1.ContentPageContent),
    related: dryv.field(sections1.ContentPageRelated).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  ContentList: dryv.schema({
    items: dryv.field(sections1.ContentListItems).array(),
    categories: dryv.field(sections0.ContentListCategories).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  LegalBasis: dryv.schema({
    subject: dryv.field(sections0.LegalBasisSubject),
    items: dryv.field(sections0.LegalBasisItems).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  CompareOptions: dryv.schema({
    place: dryv.field(sections0.CompareOptionsPlace),
    nearby: dryv.field(sections0.CompareOptionsNearby).array(),
    top: dryv.field(sections0.CompareOptionsTop).array(),
    hierarchy: dryv.field(sections1.CompareOptionsHierarchy).array(),
    metrics: dryv.field(sections0.CompareOptionsMetrics).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  Comparison: dryv.schema({
    a: dryv.field(sections0.ComparisonA),
    b: dryv.field(sections0.ComparisonB),
    rows: dryv.field(sections0.ComparisonRows).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  NearbyProjects: dryv.schema({
    radiusKm: dryv.field(p.Number),
    projects: dryv.field(sections1.NearbyProjectsProjects).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  TenderList: dryv.schema({
    summary: dryv.field(sections1.TenderListSummary),
    tenders: dryv.field(sections0.TenderListTenders).array(),
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
    .description("A leader, by the person's slug: offices, contacts, media, voting and attendance record, the fund they oversee and evidence.")
    .input(inputs.CodeInput)
    .output(documents.LeaderProfile)
    .facets(({ inputField, output }) => ({
      http: dryv.http("GET", "/v1/leaders/{code}").input(inputField("code"), dryv.path()).output(output),
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
