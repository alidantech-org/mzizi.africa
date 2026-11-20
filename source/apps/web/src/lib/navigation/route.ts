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
};
export const VIEWS: Record<ViewId, ViewDef> = {
  overview: { label: "Overview", group: "Place", allowed: [], dropOnPlaceChange: [] },
  leaders: {
    label: "Leaders",
    group: "Government",
    allowed: ["view.mode", "view.office"],
    dropOnPlaceChange: [],
  },
  elections: {
    label: "Elections",
    group: "Politics",
    allowed: ["filters.party", "sort.by", "sort.dir", "page.no", "page.limit"],
    dropOnPlaceChange: [],
  },
  parliament: {
    label: "Parliament",
    group: "Politics",
    allowed: ["view.seat"],
    dropOnPlaceChange: ["view.seat"],
  },
  institutions: {
    label: "Institutions",
    group: "Government",
    allowed: ["view.entity", "view.id", "filters.kind"],
    dropOnPlaceChange: [],
  },
  arms: { label: "Three arms", group: "Government", allowed: [], dropOnPlaceChange: [] },
  power: { label: "Power model", group: "Government", allowed: [], dropOnPlaceChange: [] },
  law: {
    label: "Law",
    group: "Government",
    allowed: ["view.entity", "view.id", "view.chapter", "view.provision"],
    dropOnPlaceChange: [],
  },
  finance: { label: "Finance analytics", group: "Money", allowed: [], dropOnPlaceChange: [] },
  suppliers: { label: "Suppliers", group: "Money", allowed: [], dropOnPlaceChange: [] },
  statistics: {
    label: "Statistics",
    group: "Data",
    allowed: ["view.indicator"],
    dropOnPlaceChange: [],
  },
  compare: {
    label: "Compare",
    group: "Data",
    allowed: ["view.places"],
    dropOnPlaceChange: ["view.places"],
  },
  sources: { label: "Sources", group: "Data", allowed: [], dropOnPlaceChange: [] },
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
  return { view, params, lang: lang && /^[a-z]{2,3}(-[A-Za-z0-9]+)*$/.test(lang) ? lang : undefined, errors };
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

/** Place switcher: stay on the same screen. Only state that depends on the old place (and pagination) is cleared. */
export function toPlace(ctx: Ctx, place: Place) {
  const drop = VIEWS[ctx.view].dropOnPlaceChange;
  const params = Object.fromEntries(Object.entries(ctx.params).filter(([k]) => !drop.includes(k) && !k.startsWith("page.")));
  return build({ ...place, lang: ctx.lang }, { view: ctx.view, params });
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
