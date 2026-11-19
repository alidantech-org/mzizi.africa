/**
 * Typed reads of the insight screens, through the generated server actions (the browser never calls the API). The
 * sections the API leaves open (`dynamic`) are typed here, once, so pages never cast. Each read returns the body or
 * throws the API's message.
 */
import { globalSearch } from "@mzizi/api-client/actions/insights/global-search.actions.ts";
import { browsePlaces } from "@mzizi/api-client/actions/insights/browse-places.actions.ts";
import { getPlaceStatistics } from "@mzizi/api-client/actions/insights/get-place-statistics.actions.ts";
import { getIndicatorSeries } from "@mzizi/api-client/actions/insights/get-indicator-series.actions.ts";
import { getIndicatorMap } from "@mzizi/api-client/actions/insights/get-indicator-map.actions.ts";
import { listLeaderboardMetrics } from "@mzizi/api-client/actions/insights/list-leaderboard-metrics.actions.ts";
import { getLeaderboard } from "@mzizi/api-client/actions/insights/get-leaderboard.actions.ts";
import { listElections } from "@mzizi/api-client/actions/insights/list-elections.actions.ts";
import { getElection } from "@mzizi/api-client/actions/insights/get-election.actions.ts";
import { getPlaceElections } from "@mzizi/api-client/actions/insights/get-place-elections.actions.ts";
import { listParties } from "@mzizi/api-client/actions/insights/list-parties.actions.ts";
import { getParty } from "@mzizi/api-client/actions/insights/get-party.actions.ts";
import { listLaw } from "@mzizi/api-client/actions/insights/list-law.actions.ts";
import { listMotions } from "@mzizi/api-client/actions/insights/list-motions.actions.ts";
import { getMotion } from "@mzizi/api-client/actions/insights/get-motion.actions.ts";
import { getLeaderProfile } from "@mzizi/api-client/actions/insights/get-leader-profile.actions.ts";
import { getPlaceCivic } from "@mzizi/api-client/actions/insights/get-place-civic.actions.ts";
import { getProject } from "@mzizi/api-client/actions/insights/get-project.actions.ts";
import { listTenders } from "@mzizi/api-client/actions/insights/list-tenders.actions.ts";
import { getNearbyProjects } from "@mzizi/api-client/actions/insights/get-nearby-projects.actions.ts";
import { getLeaderTree } from "@mzizi/api-client/actions/insights/get-leader-tree.actions.ts";
import { listFacts } from "@mzizi/api-client/actions/insights/list-facts.actions.ts";

interface Outcome { readonly success: boolean; readonly body: unknown; readonly message?: string }

async function body<T>(pending: Promise<Outcome>): Promise<T> {
  const response = await pending;
  if (!response.success || response.body === null) {
    const detail = (response.body as { message?: string } | null)?.message;
    throw new Error(detail ?? response.message ?? "This information could not be loaded.");
  }
  return response.body as T;
}
const opt = <T extends Record<string, unknown>>(o: T): Partial<T> =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== "")) as Partial<T>;

/* ---------------------------------------------------------------------------------------------- shapes */
export interface Crumb {
  featureId: string;
  /** Clean address of the place (`nairobi/westlands`); absent for the country itself. */
  path?: string | null;
  name: string;
  kindCode: string;
  kindLabel: string;
}
export interface MediaItem {
  kind: string;
  title: string | null;
  url: string;
  thumbnailUrl: string | null;
  platform: string | null;
  embedUrl: string | null;
  mimeType: string | null;
  stored: boolean;
}
export interface Evidence {
  citationId: string;
  sourceName: string;
  publisherName: string | null;
  artifactTitle: string | null;
  locator: string | null;
  verification: string | null;
}

export interface SearchHit {
  kind: string;
  kindLabel: string;
  id: string;
  code: string | null;
  title: string;
  subtitle: string | null;
  path: string[];
  featureId: string | null;
  placePath?: string | null;
  imageUrl: string | null;
}
export interface SearchResults {
  query: string;
  total: number;
  counts: Record<string, number>;
  hits: SearchHit[];
}
export interface Child {
  featureId: string;
  path?: string | null;
  name: string;
  kindCode: string;
  kindLabel: string;
  childCount: number;
  population: number | null;
}
export interface Browse {
  place: Crumb | null;
  chain: Crumb[];
  children: Child[];
  media: MediaItem[];
}

export interface Point {
  period: string;
  value: number;
  estimated: boolean | null;
}
export interface IndicatorView {
  code: string;
  name: string;
  unit: string | null;
  measure: string;
  higherIsBetter: boolean | null;
  latest: Point;
  previous: Point | null;
  change: number | null;
  series: Point[];
}
export interface Topic {
  code: string;
  label: string;
  indicators: IndicatorView[];
}
export interface Share {
  label: string;
  value: number;
  share: number;
}
export interface Comparison {
  place: Crumb;
  population: number | null;
  areaKm2: number | null;
  density: number | null;
}
export interface PlaceStatistics {
  place: Crumb;
  chain: Crumb[];
  topics: Topic[];
  breakdowns: Partial<
    Record<"sex" | "age" | "residence" | "community" | "language", Share[]>
  >;
  comparisons: Comparison[];
  siblings: {
    population: { position: number; of: number } | null;
    density: { position: number; of: number } | null;
    peers: number;
  };
  gaps: string[];
}
export interface Series {
  indicator: {
    code: string;
    name: string;
    unit: string | null;
    description?: string;
  };
  place: Crumb;
  points: Point[];
  gaps: string[];
}
export interface MapUnit {
  featureId: string;
  path?: string | null;
  name: string;
  kind: string;
  value: number | null;
  rank: number | null;
  estimated: boolean | null;
  geometry: GeoJSON.Geometry | null;
  [key: string]: unknown;
}
export interface IndicatorMap {
  indicator: {
    code: string;
    name?: string;
    unit?: string | null;
    higherIsBetter?: boolean | null;
  };
  parent: Crumb | null;
  units: MapUnit[];
  gaps: string[];
}

export interface Metric {
  code: string;
  title: string;
  domain: string;
  unit: string | null;
  higherIsBetter: boolean;
  describe: string;
}
export interface BoardRow {
  rank: number;
  featureId: string | null;
  path?: string | null;
  subjectId: string | null;
  leaderSlug?: string | null;
  name: string;
  detail: string | null;
  value: number;
  share: number | null;
}
export interface Board {
  metric: Metric;
  scope: string;
  rows: BoardRow[];
  gaps: string[];
}

export interface Candidate {
  name: string;
  party: string | null;
  partyCode: string | null;
  votes: number;
  share: number;
  won?: boolean;
  individualId?: string;
}
export interface ElectionSummary {
  electionId: string;
  code: string;
  year: number;
  heldOn: string;
  kind: string;
  contests: number;
  registeredVoters: number | null;
  validVotes: number | null;
  winner: { name: string; party: string | null; votes: number } | null;
  runnerUp: { name: string; party: string | null; votes: number } | null;
}
export interface ElectionUnit {
  featureId: string;
  path?: string | null;
  name: string;
  geometry: GeoJSON.Geometry | null;
  registered: number | null;
  ballotsCast: number | null;
  validVotes: number;
  turnout: number | null;
  winner: {
    name: string;
    party: string | null;
    partyCode: string | null;
    votes: number;
    share: number;
    margin: number | null;
  };
  candidates: Candidate[];
}
export interface ElectionDetail {
  election: {
    electionId: string;
    code: string;
    year: number;
    heldOn: string;
    contestKind: string;
  };
  contests: { kind: string; contests: number }[];
  totals: (Omit<Candidate, "won" | "individualId" | "share"> & {
    share: number;
  })[];
  units: ElectionUnit[];
  gaps: string[];
}
export interface PlaceElections {
  place: Crumb;
  elections: {
    electionId: string;
    kind: string;
    year: number;
    heldOn: string;
    contests: {
      kind: string;
      registered: number | null;
      ballotsCast: number | null;
      turnout: number | null;
      candidates: Candidate[];
    }[];
  }[];
  registrationTrend: Point[];
  turnoutTrend: {
    year: number;
    registered: number | null;
    turnout: number | null;
  }[];
  gaps: string[];
}
export interface PartyRow {
  code: string;
  name: string;
  members: number;
  votes2022: number;
  officeHolders: number;
  fundAllocationKes: number | null;
}
export interface PartyDetail {
  party: {
    code: string;
    name: string;
    registeredOn: string | null;
    media: MediaItem[];
  };
  members: {
    holderId: string | null;
    leaderSlug?: string | null;
    individualId: string;
    name: string;
    office: string | null;
    unit: string | null;
    unitId: string | null;
    unitPath?: string | null;
  }[];
  results: {
    year: number;
    contest: string;
    votes: number;
    candidates: number;
    won: number;
  }[];
  funding: { year: number; amountKes: number }[];
  gaps: string[];
}

export interface MotionRow {
  code: string;
  title: string;
  summary: string | null;
  held_on: string;
  institution: string;
  institution_id: string;
  kind: string;
  outcome: string;
  yes: number;
  no: number;
  abstain: number;
  absent: number;
}
export interface MotionMember {
  holderId: string;
  leaderSlug?: string | null;
  individualId: string;
  name: string;
  party: string | null;
  partyCode: string | null;
  position: "yes" | "no" | "abstain" | "absent";
  unit: string | null;
  office: string | null;
}
export interface MotionDetail {
  motion: {
    code: string;
    title: string;
    summary: string | null;
    held_on: string;
    sitting: string;
    institution: string;
    kind: string;
    outcome: string;
    moved_by: string | null;
    contributions?: {
      holder_id: string;
      leaderSlug?: string | null;
      name: string;
      party: string | null;
      kind: string;
      summary: string | null;
      word_count: number | null;
    }[];
  };
  tally: {
    yes: number;
    no: number;
    abstain: number;
    absent: number;
    total: number;
    passed: boolean;
  };
  parties: {
    party: string;
    yes: number;
    no: number;
    abstain: number;
    absent: number;
  }[];
  members: MotionMember[];
  legal: {
    provision: {
      designation: string;
      title: string | null;
      instrument: string | null;
    } | null;
    fiscalYear: { code: string; starts_on: string; ends_on: string } | null;
  } | null;
  gaps: string[];
}

export interface Official {
  holderId: string;
  leaderSlug?: string | null;
  officeCode: string;
  officeTitle: string;
  unitFeatureId: string | null;
  unitName: string | null;
  personName: string;
  partyName: string | null;
  tookOfficeOn: string | null;
}
export interface CivicProject {
  code: string;
  name: string;
  description?: string;
  status: string;
  started_on: string | null;
  completed_on: string | null;
  unit: string;
  unit_id: string;
  unit_path?: string | null;
  location: GeoJSON.Point | null;
  amount: number | null;
  contractor: string | null;
  media: MediaItem | null;
}
export interface PlaceCivic {
  place: Crumb;
  chain: Crumb[];
  fund: { code: string; managedBy: string | null; funds: number } | null;
  years: {
    year: number;
    total: number;
    classes: { code: string; label: string; amount: number; lines: number }[];
  }[];
  classes: { code: string; label: string; amount: number }[];
  projects: CivicProject[];
  infrastructure: {
    projects: number;
    completed: number;
    completionRate: number | null;
    areaKm2: number | null;
    population: number | null;
    perKm2: number | null;
    per100k: number | null;
    staffShare: number | null;
    projectShare: number | null;
  };
  leadership: Official[];
  gaps: string[];
}
export interface ProjectDetail {
  project: {
    code: string;
    name: string;
    description: string | null;
    status: string;
    started_on: string | null;
    completed_on: string | null;
    unit_id: string;
    unit_path?: string | null;
    unit: string;
    responsible: string | null;
    location: GeoJSON.Point | null;
  };
  money: {
    code: string;
    kind: string;
    class: string | null;
    amount: number | null;
    occurred_on: string;
  }[];
  procurement: {
    title: string | null;
    reference: string | null;
    status: string | null;
    procedure: string;
    published_on: string | null;
    closes_on: string | null;
    awarded_on: string | null;
    buyer: string | null;
    bids: { bidder: string; amount: number | null; outcome: string }[];
    contracts: {
      contractor: string;
      amount: number | null;
      signed_on: string | null;
      status: string;
    }[];
  } | null;
  media: MediaItem[];
  evidence: Evidence[];
  gaps: string[];
}
export interface Tender {
  code: string;
  title: string;
  reference: string | null;
  status: string | null;
  procedure: string;
  published_on: string | null;
  closes_on: string | null;
  awarded_on: string | null;
  buyer: string | null;
  place: string | null;
  amount: number | null;
  supplier: string | null;
  bids: number;
  disclosed: number;
  disclosedOf: number;
}
export interface TenderList {
  summary: {
    total: number;
    byStatus: { status: string; count: number; valueKes: number | null }[];
    transparency: { withContract: number; listed: number };
  };
  tenders: Tender[];
  gaps: string[];
}
export interface Leader {
  leader: {
    holderId: string;
    leaderSlug?: string | null;
    individualId: string;
    name: string;
    party: string | null;
    office: string;
    unitId: string | null;
    unitPath?: string | null;
    unit: string | null;
    institution: string | null;
    tookOfficeOn: string | null;
    birthDate: string | null;
  };
  offices: {
    holderId: string;
    leaderSlug?: string | null;
    office: string;
    unit: string | null;
    tookOfficeOn: string | null;
    leftOfficeOn: string | null;
  }[];
  contacts: {
    kind: string;
    value: string;
    visibility: string;
    scope: "personal" | "office";
  }[];
  media: MediaItem[];
  activity: {
    votes: {
      yes: number;
      no: number;
      abstain: number;
      absent: number;
      total: number;
      attendance: number | null;
    };
    contributions: { count: number; words: number };
    recent: {
      code: string;
      title: string;
      held_on: string;
      position: string;
      outcome: string;
    }[];
    speeches: {
      motion_code: string | null;
      motion: string | null;
      held_on: string;
      kind: string;
      summary: string | null;
      word_count: number | null;
    }[];
    recorded: boolean;
  };
  election: {
    year: number;
    heldOn: string;
    votes: number;
    total: number | null;
    share: number | null;
    margin: number | null;
    registered: number | null;
    candidates: number;
  }[];
  fund: {
    place: Crumb;
    fund: PlaceCivic["fund"];
    latestYear: PlaceCivic["years"][number] | null;
    classes: PlaceCivic["classes"];
    infrastructure: PlaceCivic["infrastructure"];
    projects: CivicProject[];
  } | null;
  evidence: Evidence[];
  gaps: string[];
}

/* ---------------------------------------------------------------------------------------------- reads */
export const search = (query: string, kinds?: string, limit = 30) => body<SearchResults>(globalSearch({ query: { query, ...opt({ kinds }), limit } }));
export const browse = (featureId?: string) => body<Browse>(browsePlaces({ query: opt({ featureId }) }));
export const statisticsOf = (featureId: string) => body<PlaceStatistics>(getPlaceStatistics({ params: { featureId } }));
export const seriesOf = (indicatorCode: string, featureId: string) => body<Series>(getIndicatorSeries({ params: { indicatorCode }, query: { featureId } }));
export const mapOf = (indicatorCode: string, parentFeatureId?: string, kindCode?: string) =>
  body<IndicatorMap>(getIndicatorMap({ params: { indicatorCode }, query: opt({ parentFeatureId, kindCode }) }));
export const metrics = () => body<{ metrics: Metric[] }>(listLeaderboardMetrics({}));
export const boardOf = (metricCode: string, kindCode?: string, parentFeatureId?: string, limit = 100) =>
  body<Board>(getLeaderboard({ params: { metricCode }, query: { ...opt({ kindCode, parentFeatureId }), limit } }));
export const elections = () => body<{ elections: ElectionSummary[] }>(listElections({}));
export const electionOf = (electionId: string, parentFeatureId?: string, contestKind?: string) =>
  body<ElectionDetail>(getElection({ params: { electionId }, query: opt({ parentFeatureId, contestKind }) }));
export const placeElections = (featureId: string) => body<PlaceElections>(getPlaceElections({ params: { featureId } }));
export const parties = () => body<{ parties: PartyRow[]; gaps: string[] }>(listParties({}));
export const partyOf = (code: string) => body<PartyDetail>(getParty({ params: { code } }));
export const motions = (institutionId?: string) => body<{ motions: MotionRow[] }>(listMotions({ query: opt({ institutionId }) }));
export interface LawInstrument { code: string; name: string; kindCode: string; kindLabel: string; enactedOn: string | null; provisions: number }
export const law = (kindCode?: string) => body<{ instruments: LawInstrument[]; gaps: string[] }>(listLaw({ query: opt({ kindCode }) }));
export const motionOf = (code: string) => body<MotionDetail>(getMotion({ params: { code } }));
export const leaderOf = (id: string) => body<Leader>(getLeaderProfile({ params: { code: id } }));
export const civicOf = (featureId: string) => body<PlaceCivic>(getPlaceCivic({ params: { featureId } }));
export const projectOf = (code: string) => body<ProjectDetail>(getProject({ params: { code } }));
export const tenders = (status?: string, featureId?: string) => body<TenderList>(listTenders({ query: { ...opt({ status, featureId }), limit: 80 } }));
export const nearbyOf = (latitude: number, longitude: number, radiusKm = 10) =>
  body<{ radiusKm: number; projects: NearbyProject[]; gaps: string[] }>(getNearbyProjects({ query: { latitude, longitude, radiusKm } }));
export const treeOf = (featureId?: string) =>
  body<{ place: Crumb | null; levels: TreeLevel[]; gaps: string[] }>(getLeaderTree({ query: opt({ featureId }) }));
export const facts = (featureId?: string) => body<{ facts: Fact[]; gaps: string[] }>(listFacts({ query: { ...opt({ featureId }), limit: 30 } }));

export interface NearbyProject extends Omit<
  CivicProject,
  "started_on" | "completed_on" | "description" | "unit_id" | "unit_path"
> {
  distance_km: number;
  responsible: string | null;
}

export interface TreeLeader {
  holderId: string;
  leaderSlug?: string | null;
  name: string;
  party: string | null;
  office: string;
  institution: string | null;
  how: string;
  since: string | null;
  photo: string | null;
  code: string;
}

export interface TreeLevel {
  level: string;
  label: string;
  unit: Crumb | null;
  total: number;
  groups: Record<string, TreeLeader[]>;
}

export interface Fact {
  code: string;
  statement: string;
  detail: string | null;
  topic: string | null;
  place: string | null;
  tagged: boolean;
  source: string | null;
}
