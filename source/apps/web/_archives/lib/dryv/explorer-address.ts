/** Generated from #/schemas/addresses.ExplorerAddress by mzizi.app-next. Do not edit. */
import type { ExplorerAddress } from "#/_archives/lib/types/explorer-address";
import { InterfaceLanguage } from "#/_archives/lib/types/interface-language.enum";
import { ExplorerView } from "#/_archives/lib/types/explorer-view.enum";

export const explorerFields = [
  { name: "classCode", key: "filters.class", numeric: false },
  { name: "compareTo", key: "view.compareTo", numeric: false },
  { name: "contest", key: "view.contest", numeric: false },
  { name: "entity", key: "view.entity", numeric: false },
  { name: "id", key: "view.id", numeric: false },
  { name: "indicator", key: "view.indicator", numeric: false },
  { name: "institution", key: "filters.institution", numeric: false },
  { name: "kind", key: "filters.kind", numeric: false },
  { name: "lang", key: "lang", numeric: false, choices: ["en", "sw"] },
  { name: "lens", key: "display.lens", numeric: false },
  { name: "level", key: "filters.level", numeric: false },
  { name: "metric", key: "view.metric", numeric: false },
  { name: "mode", key: "display.mode", numeric: false },
  { name: "month", key: "filters.month", numeric: false },
  { name: "pageLimit", key: "page.limit", numeric: true },
  { name: "pageNo", key: "page.no", numeric: true },
  { name: "provision", key: "view.provision", numeric: false },
  { name: "q", key: "filters.q", numeric: false },
  { name: "sortBy", key: "sort.by", numeric: false },
  { name: "sortOrder", key: "sort.order", numeric: false },
  { name: "status", key: "filters.status", numeric: false },
  { name: "suggestions", key: "display.suggestions", numeric: false },
  { name: "tab", key: "view.tab", numeric: false },
  { name: "tag", key: "filters.tag", numeric: false },
  {
    name: "view",
    key: "view",
    numeric: false,
    choices: [
      "calendar",
      "compare",
      "content",
      "coverage",
      "elections",
      "evidence",
      "explore",
      "finance",
      "infrastructure",
      "institutions",
      "laws",
      "leaders",
      "overview",
      "parliament",
      "places",
      "politics",
      "procurement",
      "promises",
      "rankings",
      "report",
      "search",
      "sources",
      "statistics",
    ],
  },
  { name: "year", key: "filters.year", numeric: true },
] as const;

const navigationEntries = [
  { view: ExplorerView.CALENDAR, label: "Calendar" },
  { view: ExplorerView.COMPARE, label: "Compare" },
  { view: ExplorerView.CONTENT, label: "Content" },
  { view: ExplorerView.COVERAGE, label: "Coverage" },
  { view: ExplorerView.ELECTIONS, label: "Elections" },
  { view: ExplorerView.EVIDENCE, label: "Evidence" },
  { view: ExplorerView.EXPLORE, label: "Explore" },
  { view: ExplorerView.FINANCE, label: "Finance" },
  { view: ExplorerView.INFRASTRUCTURE, label: "Infrastructure" },
  { view: ExplorerView.INSTITUTIONS, label: "Institutions" },
  { view: ExplorerView.LAWS, label: "Laws" },
  { view: ExplorerView.LEADERS, label: "Leaders" },
  { view: ExplorerView.OVERVIEW, label: "Overview" },
  { view: ExplorerView.PARLIAMENT, label: "Parliament" },
  { view: ExplorerView.PLACES, label: "Places" },
  { view: ExplorerView.POLITICS, label: "Politics" },
  { view: ExplorerView.PROCUREMENT, label: "Procurement" },
  { view: ExplorerView.PROMISES, label: "Promises" },
  { view: ExplorerView.RANKINGS, label: "Rankings" },
  { view: ExplorerView.REPORT, label: "Report" },
  { view: ExplorerView.SEARCH, label: "Search" },
  { view: ExplorerView.SOURCES, label: "Sources" },
  { view: ExplorerView.STATISTICS, label: "Statistics" },
] as const;

const navigationRules = [
  "00:Place:overview",
  "01:Place:places",
  "02:Place:explore",
  "10:Public life:leaders",
  "11:Public life:institutions",
  "12:Public life:laws",
  "13:Public life:parliament",
  "14:Public life:politics",
  "15:Public life:elections",
  "20:Measures and resources:statistics",
  "21:Measures and resources:compare",
  "22:Measures and resources:rankings",
  "23:Measures and resources:finance",
  "24:Measures and resources:procurement",
  "25:Measures and resources:infrastructure",
  "26:Measures and resources:promises",
  "30:Evidence and activity:calendar",
  "31:Evidence and activity:content",
  "32:Evidence and activity:sources",
  "33:Evidence and activity:evidence",
  "34:Evidence and activity:coverage",
  "35:Evidence and activity:report",
  "36:Evidence and activity:search",
];
export const explorerNavigation = navigationEntries
  .map((entry) => {
    const rule = navigationRules.find(
      (candidate) => candidate.split(":")[2] === entry.view,
    );
    const [order = "99", group = "Explore"] = rule?.split(":") ?? [];
    return { ...entry, group, order };
  })
  .sort((a, b) => a.order.localeCompare(b.order));

const viewFieldRules = [
  "calendar:entity,id,q,kind,year,month",
  "compare:tab,indicator,metric,compareTo,year,mode",
  "content:entity,id,q,kind,tag",
  "coverage:kind,level,mode",
  "elections:tab,entity,id,contest,year,kind,status,mode",
  "evidence:entity,id,q,kind,status",
  "explore:q,kind,level,mode",
  "finance:tab,entity,id,q,kind,status,year,mode",
  "infrastructure:tab,entity,id,q,classCode,status,mode",
  "institutions:tab,entity,id,institution,kind,status,mode",
  "laws:tab,entity,id,provision,q,kind,status,institution,year",
  "leaders:tab,entity,id,institution,kind,status,mode",
  "overview:",
  "parliament:tab,entity,id,q,kind,status,institution,year",
  "places:q,kind,level",
  "politics:tab,entity,id,q,kind,status,year",
  "procurement:tab,entity,id,q,kind,status,institution,year,mode",
  "promises:tab,entity,id,q,status,institution,year,suggestions,mode",
  "rankings:indicator,metric,year,level,mode",
  "report:entity,id,kind",
  "search:q,kind",
  "sources:entity,id,q,kind,status",
  "statistics:tab,indicator,metric,q,kind,year,mode,lens",
];
const viewEntityRules = [
  "calendar:event",
  "content:content",
  "elections:election,contest",
  "evidence:evidence",
  "finance:project,fund,budget",
  "infrastructure:infrastructure",
  "institutions:institution,position",
  "laws:instrument",
  "leaders:position,leader",
  "parliament:session,motion,bill",
  "politics:party",
  "procurement:tender,contract,supplier",
  "promises:promise",
  "report:report",
  "sources:source",
];
function ruleValues(rules: readonly string[], view: string): string[] {
  return (
    rules.find((rule) => rule.startsWith(`${view}:`))?.split(":")[1] ?? ""
  )
    .split(",")
    .filter(Boolean);
}

export class ExplorerAddressError extends Error {}

/** The parsing boundary accepts literal query keys, never recursively expands dotted keys. */
export function parseExplorerAddress(query: URLSearchParams): ExplorerAddress {
  const output: Record<string, string | number> = {};
  for (const key of query.keys()) {
    const field = explorerFields.find((candidate) => candidate.key === key);
    if (!field) throw new ExplorerAddressError(`Unknown query key: ${key}`);
    const entries = query.getAll(key);
    if (entries.length !== 1 || entries[0] === "")
      throw new ExplorerAddressError(`Supply one non-empty ${key}`);
    const value = entries[0]!;
    if ("choices" in field && !field.choices.some((choice) => choice === value))
      throw new ExplorerAddressError(`Unsupported ${key}`);
    if (field.numeric) {
      const number = Number(value);
      if (!Number.isSafeInteger(number))
        throw new ExplorerAddressError(`Invalid ${key}`);
      if (key.startsWith("page.") && number < 1)
        throw new ExplorerAddressError(`Invalid ${key}`);
      if (key === "page.limit" && number > 200)
        throw new ExplorerAddressError("Page limit exceeds 200");
      output[field.name] = number;
    } else output[field.name] = value;
  }
  output.view ??= "overview";
  const allowed = new Set([
    "view",
    "lang",
    "pageNo",
    "pageLimit",
    "sortBy",
    "sortOrder",
    ...ruleValues(viewFieldRules, String(output.view)),
  ]);
  for (const name of Object.keys(output)) {
    if (!allowed.has(name))
      throw new ExplorerAddressError(
        `${name} is not supported by ${output.view}`,
      );
  }
  if (
    output.entity &&
    !ruleValues(viewEntityRules, String(output.view)).includes(
      String(output.entity),
    )
  )
    throw new ExplorerAddressError("Record type is not supported by this view");
  if (Boolean(output.entity) !== Boolean(output.id))
    throw new ExplorerAddressError(
      "Record type and identity must be supplied together",
    );
  if (
    output.provision &&
    (output.view !== "laws" || output.entity !== "instrument")
  )
    throw new ExplorerAddressError("A provision requires its legal instrument");
  if (
    output.sortOrder &&
    output.sortOrder !== "asc" &&
    output.sortOrder !== "desc"
  )
    throw new ExplorerAddressError("Invalid sort direction");
  return output as unknown as ExplorerAddress;
}

/** Only the URL serializer knows query key spelling. */
export function explorerAt(path: string, state: ExplorerAddress): string {
  const query = new URLSearchParams();
  for (const field of explorerFields) {
    const value = state[field.name];
    if (
      value !== undefined &&
      value !== null &&
      !(field.name === "view" && value === "overview")
    )
      query.set(field.key, String(value));
  }
  const base = `/${path.split("/").filter(Boolean).join("/")}`;
  return query.size ? `${base}?${query}` : base;
}

/** Changing subject preserves only explicit language. */
export function explorerViewAt(
  path: string,
  view: ExplorerAddress["view"],
  current: ExplorerAddress,
): string {
  return explorerAt(path, { view, lang: current.lang });
}

/** Changing place clears record selection and paging. */
export function explorerPlaceAt(
  path: string,
  current: ExplorerAddress,
): string {
  return explorerAt(path, {
    view: current.view,
    tab: current.tab,
    lang: current.lang,
  });
}

/** Supported interface choices, authored once in the application contract. */
export const explorerLanguages = [
  { code: InterfaceLanguage.ENGLISH, label: "English" },
  { code: InterfaceLanguage.KISWAHILI, label: "Kiswahili" },
] as const;

/** Legacy section spellings belong to the authored address contract. */
const legacySectionRules = [
  "data/compare=compare",
  "data/statistics=statistics",
  "government/institutions=institutions",
  "government/law=laws",
];
export const legacyExplorerSections = Object.fromEntries(
  legacySectionRules.map((rule) => rule.split("=")),
) as Readonly<Record<string, ExplorerAddress["view"]>>;

/** Dataset membership or ordering changes invalidate the previous page number. */
export function explorerListAt(
  path: string,
  current: ExplorerAddress,
  changes: Partial<ExplorerAddress>,
): string {
  const next = { ...current, ...changes, pageNo: undefined };
  // Validate transitions using the same grammar as direct navigation.
  const href = explorerAt(path, next);
  parseExplorerAddress(new URL(href, "https://address.invalid").searchParams);
  return href;
}
