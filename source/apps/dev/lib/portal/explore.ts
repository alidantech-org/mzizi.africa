/** Typed reads and writes over the engine through the generated engine SDK: server actions, so the service key never reaches a browser. */
import { cancelJob } from "@mzizi/engine-client/actions/engine/cancel-job.actions.ts";
import { listCapabilities } from "@mzizi/engine-client/actions/engine/list-capabilities.actions.ts";
import { listJobs } from "@mzizi/engine-client/actions/engine/list-jobs.actions.ts";
import { submitJob } from "@mzizi/engine-client/actions/engine/submit-job.actions.ts";
import { getDataListPage } from "@mzizi/engine-client/actions/explore/get-data-list-page.actions.ts";
import { getFile } from "@mzizi/engine-client/actions/explore/get-file.actions.ts";
import { getJobDetail } from "@mzizi/engine-client/actions/explore/get-job-detail.actions.ts";
import { getRawFile } from "@mzizi/engine-client/actions/explore/get-raw-file.actions.ts";
import { getTablePage } from "@mzizi/engine-client/actions/explore/get-table-page.actions.ts";
import { listDatabaseDomains } from "@mzizi/engine-client/actions/explore/list-database-domains.actions.ts";
import { listDataLists } from "@mzizi/engine-client/actions/explore/list-data-lists.actions.ts";
import { listFileRoots } from "@mzizi/engine-client/actions/explore/list-file-roots.actions.ts";
import { listFiles } from "@mzizi/engine-client/actions/explore/list-files.actions.ts";
import { listTermGroups } from "@mzizi/engine-client/actions/explore/list-term-groups.actions.ts";
import { prepareCsv } from "@mzizi/engine-client/actions/explore/prepare-csv.actions.ts";
import { saveFile } from "@mzizi/engine-client/actions/explore/save-file.actions.ts";
import { tagTexts } from "@mzizi/engine-client/actions/explore/tag-texts.actions.ts";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue };

export interface Entry {
  readonly name: string;
  readonly path: string;
  readonly directory: boolean;
  readonly size: number;
  readonly modified: string;
  readonly kind: string;
}
export interface Listing {
  readonly root: string;
  readonly path: string;
  readonly parent: string | null;
  readonly entries: readonly Entry[];
}
export interface FileView {
  readonly root: string;
  readonly path: string;
  readonly name: string;
  readonly kind: string;
  readonly size: number;
  readonly modified: string;
  readonly truncated: boolean;
  readonly text: string | null;
  readonly header: readonly string[];
  readonly rows: readonly (readonly string[])[];
  readonly total_rows: number | null;
  readonly parsed: JsonValue;
  readonly actions: readonly string[];
}
export interface RootInfo {
  readonly name: string;
  readonly path: string;
}
export interface ColumnInfo {
  readonly name: string;
  readonly type: string;
  readonly nullable: boolean;
  readonly primary: boolean;
}
export interface TableInfo {
  readonly name: string;
  readonly rows: number;
  readonly columns: number;
  readonly describe: string;
}
export interface DomainInfo {
  readonly domain: string;
  readonly tables: readonly TableInfo[];
}
export interface TablePage {
  readonly domain: string;
  readonly table: string;
  readonly columns: readonly ColumnInfo[];
  readonly rows: readonly Record<string, JsonValue>[];
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
  readonly order: string;
  readonly direction: "asc" | "desc";
}
export interface DataList {
  readonly code: string;
  readonly domain: string;
  readonly title: string;
  readonly describe: string;
  readonly columns: readonly string[];
}
export interface DataListPage {
  readonly definition: DataList;
  readonly rows: readonly Record<string, JsonValue>[];
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
}
export interface Job {
  readonly id: string;
  readonly kind: string;
  readonly status: string;
  readonly attempts: number;
  readonly max_attempts: number;
  readonly input: Record<string, JsonValue>;
  readonly result: JsonValue;
  readonly error: string | null;
  readonly created_at: string;
  readonly started_at: string | null;
  readonly finished_at: string | null;
}
export interface JobEvent {
  readonly seq: number;
  readonly kind: string;
  readonly created_at: string;
  readonly data: JsonValue;
}
export interface JobDetail {
  readonly job: Job;
  readonly events: readonly JobEvent[];
  readonly output: Listing | null;
}
export interface CapabilityInfo {
  readonly name: string;
  readonly description: string;
  readonly package: string;
  readonly version: string;
  readonly input_schema: {
    readonly properties?: Record<string, SchemaProperty>;
    readonly required?: readonly string[];
  };
}
export interface SchemaProperty {
  readonly type?: string;
  readonly title?: string;
  readonly default?: JsonValue;
  readonly enum?: readonly string[];
  readonly description?: string;
  readonly anyOf?: readonly SchemaProperty[];
  readonly $ref?: string;
}
export interface PrepareResult {
  readonly header: readonly string[];
  readonly rows: readonly (readonly string[])[];
  readonly total_rows: number;
  readonly dropped_rows: number;
  readonly problems: readonly string[];
  readonly saved: string;
}
export interface TermGroup {
  readonly domain: string;
  readonly group: string;
  readonly label: string;
  readonly terms: readonly string[];
}
export interface TaggedText {
  readonly text: string;
  readonly hits: readonly { domain: string; group: string; term: string; surface: string }[];
}

/** The body of an engine response, or the engine's own message as an error. The open JSON sections are typed by the shapes above. */
async function read<T>(pending: Promise<{ success: boolean; message: string; body: unknown }>): Promise<T> {
  const response = await pending;
  if (!response.success || response.body === null || response.body === undefined) {
    const body = response.body as { detail?: unknown; message?: string } | null;
    throw new Error((typeof body?.detail === "string" ? body.detail : body?.message) || response.message || "The engine did not answer.");
  }
  return response.body as T;
}

/** A file's bytes as a data address a browser can show or download; the engine sends them as base64 through the SDK. */
export async function rawFile(root: string, path: string): Promise<{ readonly name: string; readonly contentType: string; readonly url: string }> {
  const file = await read<{ name: string; content_type: string; base64: string }>(getRawFile({ query: { root, path } }));
  return { name: file.name, contentType: file.content_type, url: `data:${file.content_type};base64,${file.base64}` };
}

export const explore = {
  roots: () => read<{ roots: readonly RootInfo[] }>(listFileRoots()).then((r) => r.roots),
  list: (root: string, path: string) => read<Listing>(listFiles({ query: { root, path } })),
  file: (root: string, path: string, offset = 0, limit = 100) => read<FileView>(getFile({ query: { root, path, offset, limit } })),
  save: (path: string, text: string, overwrite: boolean) => read<{ path: string }>(saveFile({ body: { path, text, overwrite } })),
  domains: () => read<{ domains: readonly DomainInfo[] }>(listDatabaseDomains()).then((r) => r.domains),
  table: (domain: string, table: string, p: { limit: number; offset: number; order: string; direction: string; q: string }) =>
    read<TablePage>(getTablePage({ params: { domain, table }, query: { ...p, q: p.q || undefined } })),
  lists: () => read<{ lists: readonly DataList[] }>(listDataLists()).then((r) => r.lists),
  list_page: (domain: string, code: string, limit: number, offset: number) =>
    read<DataListPage>(getDataListPage({ params: { domain, code }, query: { limit, offset } })),
  jobs: (status?: string) => read<{ jobs: readonly Job[] }>(listJobs({ query: { status, limit: 200 } })),
  job: (id: string) => read<JobDetail>(getJobDetail({ params: { jobId: id } })),
  submit: (kind: string, input: Record<string, JsonValue>) => read<Job>(submitJob({ body: { kind, input } })),
  cancel: (id: string) => read<Job>(cancelJob({ params: { jobId: id } })),
  capabilities: () => read<{ capabilities: readonly CapabilityInfo[] }>(listCapabilities()),
  prepare: (body: {
    root: string;
    path: string;
    columns: readonly { source: string; name: string; clean: readonly string[]; keep: boolean }[];
    skip_empty_rows: boolean;
    save_as: string;
  }) => read<PrepareResult>(prepareCsv({ body: { ...body, columns: body.columns.map((column) => ({ ...column, clean: [...column.clean] })) } })),
  terms: () => read<{ groups: readonly TermGroup[] }>(listTermGroups()).then((r) => r.groups),
  tag: (texts: readonly string[], domain: string) => read<{ items: readonly TaggedText[] }>(tagTexts({ body: { texts: [...texts], domain } })).then((r) => r.items),
};
