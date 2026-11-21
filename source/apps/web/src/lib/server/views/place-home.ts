import "server-only";
/**
 * Reads for the home view of a place. The address goes to the backend as the readable slugs of the URL; the backend
 * resolves it. Each read is started at once and handed to its own region of the page, so the heading and the fast
 * regions appear first.
 */
import { explorerGetExplorerBoundaries, explorerGetExplorerLocation } from "@mzizi/api-client/actions/explorer";
import { insightsGetPlaceStatisticsAt } from "@mzizi/api-client/actions/insights";
import { ExplorerBoundaryMode, type ExplorerBoundaries, type ExplorerLocation } from "@mzizi/api-client";
import type { InsightsPlaceStatistics } from "@mzizi/api-client";
import { project, type MapCanvas } from "#/lib/maps/project";

export type PlaceAddress = { country: string; trail: string[] };
const cache = () => ({ caching: { revalidate: 600, tags: ["places"] } });

const query = (a: PlaceAddress, languageCode: string) => ({
  countryCode: a.country.toUpperCase(),
  path: a.trail.length ? a.trail.join("/") : undefined,
  languageCode,
});

export const loadLocation = async (a: PlaceAddress, languageCode: string): Promise<ExplorerLocation | null> => {
  const res = await explorerGetExplorerLocation({ query: { ...query(a, languageCode), page: 1, limit: 25 }, options: cache() });
  return res.success && res.body ? res.body : null;
};

/** What a statistics read found. `failed` means the read itself did not work, which is not the same as nothing being recorded. */
export type StatisticsResult = { data: InsightsPlaceStatistics | null; failed: boolean };

/** `scope` sizes the answer to the screen: `headline` for the home view, `topics` for the topic list, `topic` for one topic's indicators. */
export const loadStatistics = async (
  a: PlaceAddress,
  languageCode: string,
  scope: "headline" | "topics" | "topic" = "headline",
  topic?: string,
): Promise<StatisticsResult> => {
  const res = await insightsGetPlaceStatisticsAt({ query: { ...query(a, languageCode), scope, topic }, options: cache() });
  return res.success && res.body ? { data: res.body, failed: false } : { data: null, failed: true };
};

/** The places inside this one drawn as one map; a place with no outlined children is drawn itself. */
export async function loadMap(
  a: PlaceAddress,
  languageCode: string,
): Promise<{ map: MapCanvas; self: boolean; withoutBoundary: number } | null> {
  const ask = async (mode: ExplorerBoundaryMode): Promise<ExplorerBoundaries | null> => {
    const res = await explorerGetExplorerBoundaries({ query: { ...query(a, languageCode), mode }, options: cache() });
    return res.success && res.body ? res.body : null;
  };
  let body = await ask(ExplorerBoundaryMode.CHILDREN);
  let self = false;
  if (!body || !body.shapes.length) {
    body = await ask(ExplorerBoundaryMode.SELF);
    self = true;
  }
  if (!body || !body.shapes.length) return null;
  // Children of one place can be of several kinds (constituencies and sub-counties overlap); draw the kind with most outlines.
  const byKind = new Map<string, number>();
  for (const s of body.shapes) byKind.set(s.kindCode, (byKind.get(s.kindCode) ?? 0) + 1);
  const kind = [...byKind.entries()].sort((x, y) => y[1] - x[1])[0]![0];
  const shapes = self ? body.shapes : body.shapes.filter((s) => s.kindCode === kind);
  const box = body.bbox.length === 4 && !self ? body.bbox : [Math.min(...shapes.map((s) => s.bbox[0]!)), Math.min(...shapes.map((s) => s.bbox[1]!)), Math.max(...shapes.map((s) => s.bbox[2]!)), Math.max(...shapes.map((s) => s.bbox[3]!))];
  return { map: project(shapes, box), self, withoutBoundary: body.withoutBoundary };
}
