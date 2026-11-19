import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { ExplorerView } from "#/_archives/lib/types/explorer-view.enum";
import { InterfaceLanguage } from "#/_archives/lib/types/interface-language.enum";

/** Explorer Address */
export interface ExplorerAddress {
  classCode?: string;
  compareTo?: string;
  contest?: string;
  entity?: string;
  id?: string;
  indicator?: string;
  institution?: string;
  kind?: string;
  lang?: InterfaceLanguage;
  lens?: string;
  level?: string;
  metric?: string;
  mode?: string;
  month?: string;
  pageLimit?: number;
  pageNo?: number;
  provision?: string;
  q?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
  suggestions?: string;
  tab?: string;
  tag?: string;
  view: ExplorerView;
  year?: number;
}

/** Field metadata for forms and results. */
export const ExplorerAddressFields: readonly FieldMeta[] = [
  { name: "classCode", label: "Class Code", kind: "string", required: false },
  { name: "compareTo", label: "Compare To", kind: "string", required: false },
  { name: "contest", label: "Contest", kind: "string", required: false },
  { name: "entity", label: "Entity", kind: "string", required: false },
  { name: "id", label: "Id", kind: "string", required: false },
  { name: "indicator", label: "Indicator", kind: "string", required: false },
  {
    name: "institution",
    label: "Institution",
    kind: "string",
    required: false,
  },
  { name: "kind", label: "Kind", kind: "string", required: false },
  {
    name: "lang",
    label: "Lang",
    kind: "enum",
    required: false,
    options: Object.values(InterfaceLanguage),
  },
  { name: "lens", label: "Lens", kind: "string", required: false },
  { name: "level", label: "Level", kind: "string", required: false },
  { name: "metric", label: "Metric", kind: "string", required: false },
  { name: "mode", label: "Mode", kind: "string", required: false },
  { name: "month", label: "Month", kind: "string", required: false },
  { name: "pageLimit", label: "Page Limit", kind: "number", required: false },
  { name: "pageNo", label: "Page No", kind: "number", required: false },
  { name: "provision", label: "Provision", kind: "string", required: false },
  { name: "q", label: "Q", kind: "string", required: false },
  { name: "sortBy", label: "Sort By", kind: "string", required: false },
  { name: "sortOrder", label: "Sort Order", kind: "string", required: false },
  { name: "status", label: "Status", kind: "string", required: false },
  {
    name: "suggestions",
    label: "Suggestions",
    kind: "string",
    required: false,
  },
  { name: "tab", label: "Tab", kind: "string", required: false },
  { name: "tag", label: "Tag", kind: "string", required: false },
  {
    name: "view",
    label: "View",
    kind: "enum",
    required: true,
    options: Object.values(ExplorerView),
  },
  { name: "year", label: "Year", kind: "number", required: false },
];
