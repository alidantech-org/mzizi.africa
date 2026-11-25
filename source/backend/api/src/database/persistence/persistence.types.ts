/** Validated canonical plan transport. SQL syntax belongs to this pack. */
export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
export type Row = { [key: string]: Json };
export interface Failure {
  code: string;
  message: string;
  status: number;
}
export interface Rule {
  kind: string;
  operator: string;
  context: string;
  path: string[];
  value: Json;
  children: Rule[];
}
export interface Check {
  rule: Rule;
  failure: Failure;
}
export interface Field {
  name: string;
  column: string;
  column_snake: string;
  scalar: string;
  optional?: boolean;
  nullable?: boolean;
  array?: boolean;
  geometry?: { shape: string; srid: number; dimensions: string | null } | null;
  schema_id?: string | null;
  default?: Json;
  min_items?: number | null;
  max_items?: number | null;
  min_length?: number | null;
  max_length?: number | null;
  minimum?: number | null;
  maximum?: number | null;
  multiple_of?: number | null;
  patterns?: string[];
  values?: Json[];
}
export interface Schema {
  id: string;
  namespace: string | null;
  table: string | null;
  fields: Field[];
  checks: Check[];
}
export interface Step {
  matches: { source_field: string; target_field: string }[];
  source: string;
  target: string;
  source_field: string;
  target_field: string;
  many: boolean;
  nullable: boolean;
}
export interface Column {
  path: Step[];
  field: string;
}
export interface Predicate {
  column: Column;
  operator: string;
  parameter: string | null;
  is_null: boolean;
}
export interface Order {
  column: Column;
  direction: string;
}
export interface Selection {
  name: string;
  kind: "field" | "related" | "count";
  column: Column | null;
  path: Step[];
  select: Selection[];
  order: Order[];
  where: Predicate[];
}
export interface Source {
  kind: string;
  name: string;
  policy: string;
  value: Json;
}
export interface Assignment {
  field: string;
  source: Source;
}
export interface Read {
  root: string;
  parameters: { name: string; source: Source; optional: boolean }[];
  where: Predicate[];
  select: Selection[];
  order: Order[];
  many: boolean;
  page: { limit: string; offset: string; max_limit: number } | null;
  envelope: { [key: string]: string } | null;
  missing: Failure | null;
}
export interface Write {
  root: string;
  kind: string;
  select: Assignment[];
  set: Assignment[];
  returning: Selection[] | null;
  envelope: string | null;
  missing: Failure | null;
}
export interface Plan {
  store: string | null;
  required_runtime_features: string[];
  operation: string;
  schemas: Schema[];
  input: string | null;
  input_fields: Field[];
  read: Read | null;
  write: Write | null;
  authenticated: boolean;
  policies: string[];
  scope: { field: string; policy: string; name: string }[];
  checks: Check[];
  failures: {
    kind: string;
    failure: Failure;
    field: string | null;
    constraint: string | null;
  }[];
  transaction: boolean;
  cache_seconds: number | null;
  invalidates: string[];
}
/** Only the application's policy adapter constructs this context; never bind it from HTTP input. */
export interface TrustedContext {
  principal: string | null;
  policies: ReadonlyMap<string, Readonly<Row>>;
}
export interface QueryConnection {
  query(sql: string, parameters?: unknown[]): Promise<unknown>;
}
export interface TransactionConnection extends QueryConnection {
  transaction<T>(work: (manager: QueryConnection) => Promise<T>): Promise<T>;
}
export interface CacheStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
  version(operation: string): Promise<string>;
  invalidate(operation: string): Promise<void>;
}

/** Internal durable adapter: it owns the transaction and invokes work with its manager. */
export interface PersistenceDurability {
  execute(
    plan: Plan,
    input: Row,
    context: TrustedContext,
    work: (manager: QueryConnection) => Promise<Json>,
  ): Promise<Json>;
}
