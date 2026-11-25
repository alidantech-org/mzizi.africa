import { createHash, randomUUID } from "node:crypto";
import type {
  Assignment,
  CacheStore,
  Check,
  Column,
  Failure,
  Field,
  Json,
  Order,
  Plan,
  PersistenceDurability,
  Predicate,
  QueryConnection,
  Row,
  Rule,
  Selection,
  Source,
  Step,
  TransactionConnection,
  TrustedContext,
} from "./persistence.types";

export abstract class PersistencePolicyResolver {
  abstract resolve(operation: string): Promise<TrustedContext>;
}

export class PersistenceFailure extends Error {
  constructor(readonly failure: Failure) {
    super(failure.message);
  }
}
const invalid = (message: string): never => {
  throw new PersistenceFailure({
    code: "validation_error",
    message,
    status: 422,
  });
};
const deny = (): never => {
  throw new PersistenceFailure({
    code: "forbidden",
    message: "Required trusted context is absent.",
    status: 403,
  });
};
const identifier = (name: string): string => `"${name.replaceAll('"', '""')}"`;
const literal = (name: string): string => `'${name.replaceAll("'", "''")}'`;
export function json(value: unknown): Json {
  if (value === null || typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(json);
  if (
    typeof value === "object" &&
    (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)
  ) {
    const result: Row = Object.create(null);
    for (const [key, item] of Object.entries(value)) result[key] = json(item);
    return result;
  }
  return invalid("Expected a finite JSON value.");
}
function row(value: Json): Row {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    return invalid("Expected an object.");
  return value;
}
function source(value: Source, input: Row, context: TrustedContext): Json | undefined {
  switch (value.kind) {
    case "input":
      return input[value.name];
    case "policy": {
      const result = context.policies.get(value.policy)?.[value.name];
      if (result === undefined) return deny();
      return result;
    }
    case "literal":
      return value.value;
    case "uuid":
      return randomUUID();
    case "now":
      return new Date().toISOString();
    case "default":
      return undefined;
    default:
      throw new Error(`Unsupported canonical source ${value.kind}`);
  }
}
function equal(left: Json | undefined, right: Json | undefined): boolean {
  return stable(left ?? null) === stable(right ?? null);
}
function evaluate(rule: Rule, input: Row, record: Row): Json | undefined {
  const args = rule.children.map((child) => evaluate(child, input, record));
  if (rule.kind === "literal") return rule.value;
  if (rule.kind === "now") return new Date().toISOString();
  if (rule.kind === "context") {
    let value: Json | undefined =
      rule.context === "input"
        ? input
        : rule.context === "record" || rule.context === "schema"
          ? record
          : input[rule.context];
    for (const key of rule.path)
      value =
        value === null || typeof value !== "object" || Array.isArray(value)
          ? undefined
          : value[key];
    return value;
  }
  if (rule.kind === "not") return args[0] !== true;
  if (rule.kind === "logical")
    return rule.operator === "and"
      ? args.every((value) => value === true)
      : args.some((value) => value === true);
  const a = args[0],
    b = args[1];
  switch (rule.operator) {
    case "equal":
      return equal(a, b);
    case "not-equal":
      return !equal(a, b);
    case "less-than":
      return (
        a != null &&
        b != null &&
        typeof a === typeof b &&
        (typeof a === "string" && typeof b === "string"
          ? a < b
          : typeof a === "number" && typeof b === "number" && a < b)
      );
    case "less-than-or-equal":
      return equal(a, b) || evaluate({ ...rule, operator: "less-than" }, input, record) === true;
    case "greater-than":
      return evaluate(
        {
          ...rule,
          children: [...rule.children].reverse(),
          operator: "less-than",
        },
        input,
        record,
      );
    case "greater-than-or-equal":
      return equal(a, b) || evaluate({ ...rule, operator: "greater-than" }, input, record) === true;
    case "add":
    case "subtract":
    case "multiply":
    case "divide": {
      if (!args.every((value) => typeof value === "number" && Number.isFinite(value)))
        return invalid("Arithmetic requires finite numbers.");
      return args.slice(1).reduce<Json | undefined>((left, right) => {
        if (typeof left !== "number" || typeof right !== "number")
          return invalid("Invalid arithmetic.");
        const result =
          rule.operator === "add"
            ? left + right
            : rule.operator === "subtract"
              ? left - right
              : rule.operator === "multiply"
                ? left * right
                : left / right;
        return Number.isFinite(result) ? result : invalid("Invalid arithmetic result.");
      }, args[0]);
    }
    default:
      throw new Error(`Unsupported rule ${rule.kind}/${rule.operator}`);
  }
}
function checks(items: Check[], input: Row, record: Row): void {
  for (const item of items)
    if (evaluate(item.rule, input, record) !== true) throw new PersistenceFailure(item.failure);
}
function validate(field: Field, value: Json | undefined): void {
  if (value === undefined) {
    if (!field.optional && field.default === null) invalid(`Missing ${field.name}`);
    return;
  }
  if (value === null) {
    if (!field.nullable) invalid(`Null ${field.name}`);
    return;
  }
  if (field.array) {
    if (!Array.isArray(value)) return invalid(`Expected array ${field.name}`);
    if (
      (field.min_items !== null && value.length < field.min_items) ||
      (field.max_items !== null && value.length > field.max_items)
    )
      invalid(`Array bounds ${field.name}`);
    for (const item of value) validate({ ...field, array: false }, item);
    return;
  }
  if (field.scalar === "integer" && (typeof value !== "number" || !Number.isSafeInteger(value)))
    invalid(`Expected safe integer ${field.name}`);
  if ((field.scalar === "float" || field.scalar === "decimal") && typeof value !== "number")
    invalid(`Expected number ${field.name}`);
  if (field.scalar === "boolean" && typeof value !== "boolean")
    invalid(`Expected boolean ${field.name}`);
  if (["string", "uuid", "date", "instant"].includes(field.scalar)) {
    if (typeof value !== "string") return invalid(`Expected string ${field.name}`);
    if (
      (field.min_length !== null && [...value].length < field.min_length) ||
      (field.max_length !== null && [...value].length > field.max_length)
    )
      invalid(`String bounds ${field.name}`);
    if (field.patterns.some((pattern) => !new RegExp(pattern).test(value)))
      invalid(`Pattern ${field.name}`);
    if (
      field.scalar === "uuid" &&
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
    )
      invalid(`UUID ${field.name}`);
    if (
      field.scalar === "date" &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
        !Number.isFinite(Date.parse(value)) ||
        new Date(value).toISOString().slice(0, 10) !== value)
    )
      invalid(`Date ${field.name}`);
    if (
      field.scalar === "instant" &&
      (!/(Z|[+-]\d{2}:\d{2})$/.test(value) || !Number.isFinite(Date.parse(value)))
    )
      invalid(`Instant ${field.name}`);
  }
  if (
    typeof value === "number" &&
    ((field.minimum !== null && value < field.minimum) ||
      (field.maximum !== null && value > field.maximum) ||
      (field.multiple_of !== null &&
        Math.abs(value / field.multiple_of - Math.round(value / field.multiple_of)) > 1e-9))
  )
    invalid(`Number bounds ${field.name}`);
  if (field.values.length && !field.values.some((item) => equal(item, value)))
    invalid(`Enum ${field.name}`);
}
class Sql {
  readonly values: Json[] = [];
  private sequence = 0;
  constructor(
    readonly plan: Plan,
    readonly parameters: Row,
    readonly snake: boolean,
  ) {}
  bind(value: Json): string {
    this.values.push(value);
    return `$${this.values.length}`;
  }
  alias(): string {
    return `r${this.sequence++}`;
  }
  schema(id: string) {
    const schema = this.plan.schemas.find((item) => item.id === id);
    if (!schema || !schema.table) throw new Error(`Missing stored schema ${id}`);
    return schema;
  }
  table(id: string): string {
    const schema = this.schema(id);
    return [schema.namespace, schema.table]
      .filter((value): value is string => value !== null)
      .map(identifier)
      .join(".");
  }
  field(id: string, name: string, alias: string): string {
    const field = this.schema(id).fields.find((item) => item.name === name);
    if (!field) throw new Error(`Missing field ${id}/${name}`);
    return `${alias}.${identifier(this.snake ? field.column_snake : field.column)}`;
  }
  path(
    root: string,
    alias: string,
    path: Step[],
  ): { root: string; alias: string; from: string; where: string } {
    let from = "",
      where = "",
      current = root,
      previous = alias;
    for (const step of path) {
      if (step.source !== current) throw new Error("Discontinuous canonical path");
      const next = this.alias();
      const condition = [
        { source_field: step.source_field, target_field: step.target_field },
        ...step.matches,
      ]
        .map(
          (pair) =>
            `${this.field(step.target, pair.target_field, next)} = ${this.field(current, pair.source_field, previous)}`,
        )
        .join(" AND ");
      if (!from) {
        from = `${this.table(step.target)} ${next}`;
        where = condition;
      } else from += ` JOIN ${this.table(step.target)} ${next} ON ${condition}`;
      current = step.target;
      previous = next;
    }
    return { root: current, alias: previous, from, where };
  }
  column(root: string, alias: string, column: Column): string {
    if (!column.path.length) {
      const field = this.schema(root).fields.find((item) => item.name === column.field);
      const expression = this.field(root, column.field, alias);
      if (field?.scalar === "geometry") {
        if (field.geometry?.srid !== 4326)
          throw new Error("This pack requires an explicit geometry adapter outside SRID 4326");
        return `ST_AsGeoJSON(${expression})::jsonb`;
      }
      return expression;
    }
    const target = this.path(root, alias, column.path);
    return `(SELECT ${this.column(target.root, target.alias, { field: column.field, path: [] })} FROM ${target.from} WHERE ${target.where})`;
  }
  predicates(root: string, alias: string, items: Predicate[]): string[] {
    const operators: { [key: string]: string } = {
      equal: "IS NOT DISTINCT FROM",
      "less-than": "<",
      "less-than-or-equal": "<=",
      "greater-than": ">",
      "greater-than-or-equal": ">=",
    };
    return items.flatMap((item) => {
      const column = this.column(root, alias, item.column);
      if (item.operator === "null") return [`${column} IS ${item.is_null ? "" : "NOT "}NULL`];
      const value = item.parameter === null ? undefined : this.parameters[item.parameter];
      if (value === undefined) return [];
      if (item.operator === "prefix")
        return [
          `${column} LIKE ${this.bind(String(value).replace(/[\\%_]/g, "\\$&") + "%")} ESCAPE E'\\\\'`,
        ];
      const operator = operators[item.operator];
      if (!operator) throw new Error(`Unsupported predicate ${item.operator}`);
      return [`${column} ${operator} ${this.bind(value)}`];
    });
  }
  ordering(root: string, alias: string, order: Order[]): string {
    return order.length
      ? " ORDER BY " +
          order
            .map(
              (item) =>
                `${this.column(root, alias, item.column)} ${item.direction === "desc" ? "DESC" : "ASC"}`,
            )
            .join(",")
      : "";
  }
  shape(root: string, alias: string, selections: Selection[]): string {
    return (
      "jsonb_build_object(" +
      selections
        .flatMap((item) => {
          let expression: string;
          if (item.kind === "field") {
            if (!item.column) throw new Error("Missing selected column");
            expression = this.column(root, alias, item.column);
          } else {
            const target = this.path(root, alias, item.path);
            const where =
              [target.where, ...this.predicates(target.root, target.alias, item.where)]
                .filter(Boolean)
                .join(" AND ") || "TRUE";
            if (item.kind === "count")
              expression = `(SELECT count(*) FROM ${target.from} WHERE ${where})`;
            else {
              const selection = this.shape(target.root, target.alias, item.select);
              const query = `SELECT ${selection} AS value FROM ${target.from} WHERE ${where}${this.ordering(target.root, target.alias, item.order)}`;
              expression = item.path.some((step) => step.many)
                ? `(SELECT COALESCE(jsonb_agg(n.value),'[]'::jsonb) FROM (${query}) n)`
                : `(${query})`;
            }
          }
          return [literal(item.name), expression];
        })
        .join(",") +
      ")"
    );
  }
}
function stable(value: Json): string {
  if (Array.isArray(value)) return "[" + value.map(stable).join(",") + "]";
  if (value !== null && typeof value === "object")
    return (
      "{" +
      Object.keys(value)
        .sort()
        .map((key) => JSON.stringify(key) + ":" + stable(value[key] ?? null))
        .join(",") +
      "}"
    );
  return JSON.stringify(value);
}
async function rows(connection: QueryConnection, sql: string, values: Json[]): Promise<Row[]> {
  const result = json(await connection.query(sql, values));
  if (!Array.isArray(result)) throw new Error("Database did not return rows");
  return result.map(row);
}
/** One instance per selected logical store. Connection resolution belongs to application DI. */
export class StoreConnections {
  constructor(readonly stores: ReadonlyMap<string, TransactionConnection>) {}
  resolve(store: string | null): TransactionConnection {
    if (store === null)
      throw new Error("A named store connection requires canonical store ownership");
    const connection = this.stores.get(store);
    if (!connection) throw new Error(`No explicitly configured connection for store ${store}`);
    return connection;
  }
}

export class PersistenceRuntime {
  constructor(
    readonly connection: TransactionConnection | StoreConnections,
    readonly cache?: CacheStore,
    readonly snake = true,
    readonly durability?: PersistenceDurability,
  ) {}
  async execute(plan: Plan, value: unknown, context: TrustedContext): Promise<Json> {
    if (
      plan.required_runtime_features.some(
        (feature) => !this.durability || !["events", "retry", "idempotency"].includes(feature),
      )
    )
      throw new Error(
        `This pack requires an explicit runtime adapter for: ${plan.required_runtime_features.join(", ")}`,
      );
    const connection =
      this.connection instanceof StoreConnections
        ? this.connection.resolve(plan.store)
        : plan.store === null
          ? this.connection
          : (() => {
              throw new Error("Use StoreConnections for canonical named stores");
            })();
    const input = row(json(value));
    if (plan.authenticated && !context.principal) deny();
    for (const policy of plan.policies) if (!context.policies.has(policy)) deny();
    for (const field of plan.input_fields) validate(field, input[field.name]);
    for (const name of Object.keys(input))
      if (!plan.input_fields.some((field) => field.name === name)) invalid(`Unknown input ${name}`);
    checks(plan.checks, input, {});
    let cacheKey: string | undefined;
    if (plan.read && plan.cache_seconds && this.cache) {
      const policies: Row = Object.create(null);
      for (const [key, values] of context.policies) policies[key] = { ...values };
      cacheKey = `dryv:${plan.operation}:${await this.cache.version(plan.operation)}:${createHash(
        "sha256",
      )
        .update(
          stable({
            input,
            principal: context.principal,
            policies,
            store: plan.store,
          }),
        )
        .digest("hex")}`;
      const cached = await this.cache.get(cacheKey);
      if (cached !== null) return json(JSON.parse(cached));
    }
    let result: Json;
    try {
      result =
        this.durability && (plan.write || plan.required_runtime_features.length)
          ? await this.durability.execute(plan, input, context, (manager) =>
              this.run(manager, plan, input, context),
            )
          : plan.write || plan.transaction
            ? await connection.transaction((manager) => this.run(manager, plan, input, context))
            : await this.run(connection, plan, input, context);
    } catch (error) {
      this.failure(plan, error);
    }
    // Awaiting transaction() above proves commit; rollback never reaches invalidation.
    if (plan.write && this.cache)
      for (const operation of plan.invalidates) await this.cache.invalidate(operation);
    if (cacheKey && plan.cache_seconds && this.cache)
      await this.cache.set(cacheKey, JSON.stringify(result), plan.cache_seconds);
    return result;
  }
  private failure(plan: Plan, error: unknown): never {
    if (error instanceof PersistenceFailure) throw error;
    if (typeof error === "object" && error !== null && "code" in error) {
      const code = error.code;
      const kinds: { [key: string]: string } = {
        "23502": "not-null",
        "23503": plan.write?.kind === "delete" ? "referenced" : "foreign-key",
        "23505": "unique",
        "23514": "check",
        "23P01": "exclusion",
      };
      const constraint = "constraint" in error ? error.constraint : undefined;
      const column = "column" in error ? error.column : undefined;
      const binding = plan.failures.find(
        (item) =>
          item.kind === kinds[String(code)] &&
          (!item.constraint || item.constraint === constraint) &&
          (!item.field ||
            plan.schemas
              .flatMap((schema) => schema.fields)
              .some(
                (field) =>
                  field.name === item.field &&
                  (this.snake ? field.column_snake : field.column) === column,
              )),
      );
      if (binding) throw new PersistenceFailure(binding.failure);
    }
    throw error;
  }
  /** Called only inside the durable adapter's selected-store transaction. */
  async executeInUnitOfWork(
    plan: Plan,
    value: unknown,
    context: TrustedContext,
    connection: QueryConnection,
  ): Promise<Json> {
    const input = row(json(value));
    if (plan.authenticated && !context.principal) deny();
    for (const policy of plan.policies) if (!context.policies.has(policy)) deny();
    for (const field of plan.input_fields) validate(field, input[field.name]);
    for (const name of Object.keys(input))
      if (!plan.input_fields.some((field) => field.name === name)) invalid(`Unknown input ${name}`);
    checks(plan.checks, input, {});
    try {
      return await this.run(connection, plan, input, context);
    } catch (error) {
      return this.failure(plan, error);
    }
  }
  private async run(
    connection: QueryConnection,
    plan: Plan,
    input: Row,
    context: TrustedContext,
  ): Promise<Json> {
    const parameters: Row = Object.create(null);
    for (const parameter of plan.read?.parameters ?? []) {
      const value = source(parameter.source, input, context);
      if (value === undefined && !parameter.optional)
        invalid(`Missing query parameter ${parameter.name}`);
      if (value !== undefined) parameters[parameter.name] = value;
    }
    const sql = new Sql(plan, parameters, this.snake);
    const root = plan.read?.root ?? plan.write?.root;
    if (!root) throw new Error("Operation has no persistence plan");
    const alias = sql.alias();
    const scopes = plan.scope.map((binding) => {
      const value = context.policies.get(binding.policy)?.[binding.name];
      if (value === undefined) return deny();
      return { field: binding.field, value };
    });
    if (plan.read) {
      const read = plan.read;
      const where =
        [
          ...sql.predicates(root, alias, read.where),
          ...scopes.map(
            (item) =>
              `${sql.field(root, item.field, alias)} IS NOT DISTINCT FROM ${sql.bind(item.value)}`,
          ),
        ].join(" AND ") || "TRUE";
      const from = ` FROM ${sql.table(root)} ${alias} WHERE ${where}`;
      const limit = read.page
        ? Math.min(
            read.page.max_limit,
            Math.max(1, Math.trunc(Number(parameters[read.page.limit] ?? 50))),
          )
        : undefined;
      const offset = read.page
        ? Math.max(0, Math.trunc(Number(parameters[read.page.offset] ?? 0)))
        : 0;
      if (limit !== undefined && (!Number.isSafeInteger(limit) || !Number.isSafeInteger(offset)))
        invalid("Invalid page window");
      const shape = sql.shape(root, alias, read.select);
      const selected = await rows(
        connection,
        `SELECT ${shape} AS value${from}${sql.ordering(root, alias, read.order)}${limit === undefined ? "" : ` LIMIT ${sql.bind(limit)} OFFSET ${sql.bind(offset)}`}`,
        sql.values,
      );
      if (!read.many && selected.length > 1)
        throw new Error("Single-result query returned multiple rows");
      if (!selected.length && read.missing) throw new PersistenceFailure(read.missing);
      const data = read.many
        ? selected.map((item) => item.value ?? null)
        : (selected[0]?.value ?? null);
      if (!read.envelope) return data;
      // Count uses only predicate bindings, never selected subquery/order/page bindings.
      const totalSql = new Sql(plan, parameters, this.snake);
      const totalAlias = totalSql.alias();
      const totalWhere =
        [
          ...totalSql.predicates(root, totalAlias, read.where),
          ...scopes.map(
            (item) =>
              `${totalSql.field(root, item.field, totalAlias)} IS NOT DISTINCT FROM ${totalSql.bind(item.value)}`,
          ),
        ].join(" AND ") || "TRUE";
      const count = await rows(
        connection,
        `SELECT count(*)::text AS total FROM ${totalSql.table(root)} ${totalAlias} WHERE ${totalWhere}`,
        totalSql.values,
      );
      const total = Number(count[0]?.total ?? 0);
      if (!Number.isSafeInteger(total)) throw new Error("Count exceeds safe integer range");
      const result: Row = Object.create(null);
      for (const [name, member] of Object.entries(read.envelope))
        result[name] =
          member === "rows"
            ? data
            : member === "total"
              ? total
              : member === "limit"
                ? (limit ?? selected.length)
                : member === "offset"
                  ? offset
                  : invalid(`Unsupported envelope ${member}`);
      return result;
    }
    const write = plan.write;
    if (!write) throw new Error("Missing mutation");
    const assignments: {
      field: string;
      value: Json | undefined;
      default: boolean;
    }[] = write.set.map((item) => ({
      field: item.field,
      value: source(item.source, input, context),
      default: item.source.kind === "default",
    }));
    for (const scope of scopes) {
      const assignment = assignments.find((item) => item.field === scope.field);
      if (assignment && !equal(assignment.value, scope.value)) deny();
      if (write.kind === "create" && !assignment) assignments.push({ ...scope, default: false });
    }
    const selector = write.select.map((item) => {
      const value = source(item.source, input, context);
      if (value === undefined) return invalid(`Missing selector ${item.field}`);
      return `${sql.field(root, item.field, alias)} IS NOT DISTINCT FROM ${sql.bind(value)}`;
    });
    if (write.kind !== "create")
      selector.push(
        ...scopes.map(
          (item) =>
            `${sql.field(root, item.field, alias)} IS NOT DISTINCT FROM ${sql.bind(item.value)}`,
        ),
      );
    const present = assignments.filter((item) => item.default || item.value !== undefined);
    let statement: string;
    const expression = (item: (typeof present)[number]): string => {
      if (item.default) return "DEFAULT";
      const field = sql.schema(root).fields.find((field) => field.name === item.field);
      const bound = sql.bind(item.value ?? null);
      if (field?.scalar === "geometry" && item.value !== null) {
        if (field.geometry?.srid !== 4326)
          throw new Error("This pack requires an explicit geometry adapter outside SRID 4326");
        return `ST_SetSRID(ST_GeomFromGeoJSON(${bound}::json),4326)`;
      }
      return bound;
    };
    if (write.kind === "create")
      statement = present.length
        ? `INSERT INTO ${sql.table(root)} AS ${alias} (${present.map((item) => sql.field(root, item.field, alias).slice(alias.length + 1)).join(",")}) VALUES (${present.map(expression).join(",")})`
        : `INSERT INTO ${sql.table(root)} AS ${alias} DEFAULT VALUES`;
    else if (write.kind === "delete")
      statement = `DELETE FROM ${sql.table(root)} AS ${alias} WHERE ${selector.join(" AND ")}`;
    else {
      if (!present.length) invalid("Mutation has no supplied assignments");
      statement = `UPDATE ${sql.table(root)} AS ${alias} SET ${present.map((item) => `${sql.field(root, item.field, alias).slice(alias.length + 1)} = ${expression(item)}`).join(",")} WHERE ${selector.join(" AND ")}`;
    }
    const result = await rows(
      connection,
      `${statement} RETURNING ${write.returning ? sql.shape(root, alias, write.returning) : "'null'::jsonb"} AS value`,
      sql.values,
    );
    if (!result.length && write.missing) throw new PersistenceFailure(write.missing);
    if (result.length > 1) invalid("Mutation selected multiple rows"); // transaction rolls the entire mutation back
    const data = result[0]?.value ?? null;
    return write.envelope ? { [write.envelope]: data } : data;
  }
}
