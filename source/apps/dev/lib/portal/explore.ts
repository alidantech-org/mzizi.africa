/** Typed reads and writes over the engine's `/v1/explore` endpoints (files, database, term knowledge) and jobs. */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

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

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE}/${path}`, {
    cache: "no-store",
    ...init,
    headers: init?.body ? { "content-type": "application/json" } : undefined,
  });
  const text = await response.text();
  if (!response.ok) {
    let message = text;
    try {
      const parsed = JSON.parse(text) as { detail?: unknown; message?: string };
      message = typeof parsed.detail === "string" ? parsed.detail : (parsed.message ?? text);
    } catch {
      /* keep the raw text */
    }
    throw new Error(message || `The engine answered ${response.status}.`);
  }
  return JSON.parse(text) as T;
}

const query = (params: Record<string, string | number | undefined>): string => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : "";
};

export const rawUrl = (root: string, path: string): string =>
  `${BASE}/v1/explore/file/raw${query({ root, path })}`;

export const explore = {
  roots: () => call<{ roots: readonly RootInfo[] }>("v1/explore/roots").then((r) => r.roots),
  list: (root: string, path: string) =>
    call<Listing>(`v1/explore/files${query({ root, path })}`),
  file: (root: string, path: string, offset = 0, limit = 100) =>
    call<FileView>(`v1/explore/file${query({ root, path, offset, limit })}`),
  save: (path: string, text: string, overwrite: boolean) =>
    call<{ path: string }>("v1/explore/file", {
      method: "PUT",
      body: JSON.stringify({ path, text, overwrite }),
    }),
  domains: () => call<{ domains: readonly DomainInfo[] }>("v1/explore/db/domains").then((r) => r.domains),
  table: (
    domain: string,
    table: string,
    p: { limit: number; offset: number; order: string; direction: string; q: string },
  ) => call<TablePage>(`v1/explore/db/tables/${domain}/${table}${query(p)}`),
  lists: () => call<{ lists: readonly DataList[] }>("v1/explore/db/lists").then((r) => r.lists),
  list_page: (domain: string, code: string, limit: number, offset: number) =>
    call<DataListPage>(`v1/explore/db/lists/${domain}/${code}${query({ limit, offset })}`),
  jobs: (status?: string) =>
    call<{ jobs: readonly Job[] }>(`v1/jobs${query({ status, limit: 200 })}`),
  job: (id: string) => call<JobDetail>(`v1/explore/jobs/${id}`),
  submit: (kind: string, input: Record<string, JsonValue>) =>
    call<Job>("v1/jobs", { method: "POST", body: JSON.stringify({ kind, input }) }),
  cancel: (id: string) => call<Job>(`v1/jobs/${id}/cancel`, { method: "POST", body: "{}" }),
  capabilities: () => call<{ capabilities: readonly CapabilityInfo[] }>("capabilities"),
  prepare: (body: {
    root: string;
    path: string;
    columns: readonly { source: string; name: string; clean: readonly string[]; keep: boolean }[];
    skip_empty_rows: boolean;
    save_as: string;
  }) => call<PrepareResult>("v1/explore/csv/prepare", { method: "POST", body: JSON.stringify(body) }),
  terms: () => call<{ groups: readonly TermGroup[] }>("v1/explore/terms").then((r) => r.groups),
  tag: (texts: readonly string[], domain: string) =>
    call<{ items: readonly TaggedText[] }>("v1/explore/terms/tag", {
      method: "POST",
      body: JSON.stringify({ texts, domain }),
    }).then((r) => r.items),
};
