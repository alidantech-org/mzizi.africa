import { demoHref } from "#/lib/navigation/base";
/**
 * URL model. The path identifies a place (/ke/nairobi/westlands). The query chooses what to show about it:
 *   view            main subject          view.*     subsection or selected record
 *   filters.*       which records         sort.*     ordering
 *   page.*          pagination            display.*  shareable presentation
 *   lang            optional interface language
 * Pure and client-safe: no data imports.
 */
export const COUNTRIES = [
  { code: "ke", iso: "KE", dial: "+254", name: "Kenya", levels: ["County", "Constituency", "Ward"] },
  { code: "za", iso: "ZA", dial: "+27", name: "South Africa", levels: ["Province"] },
  { code: "ng", iso: "NG", dial: "+234", name: "Nigeria", levels: ["State"] },
  { code: "tz", iso: "TZ", dial: "+255", name: "Tanzania", levels: ["Region"] },
] as const;
export type CountryCode = (typeof COUNTRIES)[number]["code"];
export const country = (code: string) => COUNTRIES.find((c) => c.code === code);

export type ViewId =
  | "overview"
  | "leaders"
  | "institutions"
  | "arms"
  | "power"
  | "law"
  | "parliament"
  | "elections"
  | "finance"
  | "suppliers"
  | "statistics"
  | "compare"
  | "sources";

type ViewDef = {
  label: string;
  group: "Place" | "Politics" | "Government" | "Money" | "Data";
  allowed: string[];
  /** Subsection state that stops making sense when the place changes. Everything else is kept so switching place never loses the screen. */
  dropOnPlaceChange: string[];
  /** Countries that have data for this view ("all" means every country) and the deepest place level where it still makes sense (0 = country, 1 = county...). */
  countries: readonly string[] | "all";
  maxDepth: number;
};
export const VIEWS: Record<ViewId, ViewDef> = {
  overview: { label: "Overview", group: "Place", allowed: [], dropOnPlaceChange: [], countries: "all", maxDepth: 9 },
  leaders: {
    label: "Leaders",
    group: "Government",
    allowed: ["view.mode", "view.office"],
    dropOnPlaceChange: [],
    countries: ["ke"],
    maxDepth: 9,
  },
  elections: {
    label: "Elections",
    group: "Politics",
    allowed: ["filters.party", "sort.by", "sort.dir", "page.no", "page.limit"],
    dropOnPlaceChange: [],
    countries: ["ke"],
    maxDepth: 2,
  },
  parliament: {
    label: "Parliament",
    group: "Politics",
    allowed: ["view.seat"],
    dropOnPlaceChange: ["view.seat"],
    countries: ["ke"],
    maxDepth: 2,
  },
  institutions: {
    label: "Institutions",
    group: "Government",
    allowed: ["view.entity", "view.id", "filters.kind"],
    dropOnPlaceChange: [],
    countries: ["ke"],
    maxDepth: 1,
  },
  arms: { label: "Three arms", group: "Government", allowed: [], dropOnPlaceChange: [], countries: ["ke"], maxDepth: 1 },
  power: { label: "Power model", group: "Government", allowed: [], dropOnPlaceChange: [], countries: ["ke"], maxDepth: 1 },
  law: {
    label: "Law",
    group: "Government",
    allowed: ["view.entity", "view.id", "view.chapter", "view.provision"],
    dropOnPlaceChange: [],
    countries: ["ke"],
    maxDepth: 9,
  },
  finance: { label: "Finance analytics", group: "Money", allowed: [], dropOnPlaceChange: [], countries: ["ke"], maxDepth: 3 },
  suppliers: { label: "Suppliers", group: "Money", allowed: [], dropOnPlaceChange: [], countries: ["ke"], maxDepth: 1 },
  statistics: {
    label: "Statistics",
    group: "Data",
    allowed: ["view.indicator"],
    dropOnPlaceChange: [],
    countries: ["ke"],
    maxDepth: 2,
  },
  compare: {
    label: "Compare",
    group: "Data",
    allowed: ["view.places"],
    dropOnPlaceChange: ["view.places"],
    countries: "all",
    maxDepth: 9,
  },
  sources: { label: "Sources", group: "Data", allowed: [], dropOnPlaceChange: [], countries: "all", maxDepth: 9 },
};
export const isView = (v: string): v is ViewId => v in VIEWS;

export type Ctx = { country: string; trail: string[]; view: ViewId; params: Record<string, string>; lang?: string };
export type Place = Pick<Ctx, "country" | "trail">;

const NAMESPACES = /^(view|filters|sort|page|display)(\..+)?$/;
type Query = Record<string, string | string[] | undefined>;

/** Reads the query. Unknown view or parameters never silently change meaning: they come back as errors. */
export function parseQuery(sp: Query): { view: ViewId; params: Record<string, string>; lang?: string; errors: string[] } {
  const errors: string[] = [];
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const raw = first(sp.view) ?? "overview";
  const view: ViewId = isView(raw) ? raw : "overview";
  if (!isView(raw)) errors.push(`Unknown view "${raw}".`);
  const params: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp)) {
    const value = first(v);
    if (value == null || k === "view" || k === "lang" || !NAMESPACES.test(k)) continue;
    if (VIEWS[view].allowed.includes(k)) params[k] = value;
    else errors.push(`"${k}" is not used by the ${VIEWS[view].label} view.`);
  }
  const lang = first(sp.lang);
  return { view, params, lang: lang === "sw" || lang === "en" ? lang : undefined, errors };
}

export function pathOf(p: Place) {
  return demoHref(`/${[p.country, ...p.trail].join("/")}`);
}

/** Builds a URL. `view` defaults to the current one; `params` are used as given (nothing is carried over implicitly). */
export function build(
  ctx: Pick<Ctx, "country" | "trail" | "lang"> & Partial<Pick<Ctx, "view">>,
  opts: { view?: ViewId; params?: Record<string, string> } = {},
) {
  const view = opts.view ?? ctx.view ?? "overview";
  const q = new URLSearchParams();
  if (view !== "overview") q.set("view", view);
  for (const [k, v] of Object.entries(opts.params ?? {})) if (v !== "" && v != null) q.set(k, v);
  if (ctx.lang) q.set("lang", ctx.lang);
  const s = q.toString();
  return pathOf(ctx) + (s ? `?${s}` : "");
}

/** Sidebar: change the subject, keep the place and language, clear everything else. */
export const toView = (ctx: Ctx, view: ViewId) => build(ctx, { view, params: {} });

/** Name of a level of a country: depth 0 is the country itself, 1 the first level (county, province...), and so on. */
export function levelName(countryCode: string, depth: number) {
  if (depth <= 0) return "country";
  return (country(countryCode)?.levels as readonly string[] | undefined)?.[depth - 1]?.toLowerCase() ?? "place";
}

/** Is this subject meaningful at this place? Data exists for the country, and the place is not deeper than the subject supports. */
export function available(view: ViewId, place: Place) {
  const v = VIEWS[view];
  return (v.countries === "all" || v.countries.includes(place.country)) && place.trail.length <= v.maxDepth;
}

/** Why a subject cannot be opened at this place, in plain words, or null when it can. Links are disabled with this reason, never removed. */
export function whyUnavailable(view: ViewId, place: Place): string | null {
  if (available(view, place)) return null;
  const v = VIEWS[view];
  const c = country(place.country);
  if (v.countries !== "all" && !v.countries.includes(place.country))
    return `${v.label} has no data for ${c?.name ?? "this country"} yet. It is loaded for ${v.countries.map((x) => country(x)?.name ?? x).join(" and ")}.`;
  return `${v.label} only applies down to ${levelName(place.country, v.maxDepth)} level. You are at ${levelName(place.country, place.trail.length)} level. Go up to ${place.trail.length > v.maxDepth ? "a " + levelName(place.country, v.maxDepth) : "a higher level"} to open it.`;
}

/** Place switcher: stay on the same screen. Only state that depends on the old place (and pagination) is cleared. If the subject does not apply at the new place, fall back to the overview. */
export function toPlace(ctx: Ctx, place: Place) {
  const view = available(ctx.view, place) ? ctx.view : "overview";
  const drop = VIEWS[ctx.view].dropOnPlaceChange;
  const params =
    view === ctx.view
      ? Object.fromEntries(Object.entries(ctx.params).filter(([k]) => !drop.includes(k) && !k.startsWith("page.")))
      : {};
  return build({ ...place, lang: ctx.lang }, { view, params });
}

/** Change filters, sorting or a subsection in place. Pagination resets unless the change is to the page itself. */
export function withParams(ctx: Ctx, patch: Record<string, string | null>) {
  const next = { ...ctx.params };
  for (const [k, v] of Object.entries(patch)) v == null ? delete next[k] : (next[k] = v);
  if (!Object.keys(patch).some((k) => k.startsWith("page."))) delete next["page.no"];
  return build(ctx, { params: next });
}

export const prettify = (slug: string) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

/** The context used for sidebar links when the page is not an explorer page (home, me, help). */
export const DEFAULT_PLACE: Place = { country: "ke", trail: [] };
