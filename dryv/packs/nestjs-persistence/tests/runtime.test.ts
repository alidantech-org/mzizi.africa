import { afterAll, beforeAll, expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { DataSource } from "typeorm";
import {
  PersistenceFailure,
  PersistenceRuntime,
  StoreConnections,
} from "#runtime/persistence.runtime";
import { TypeOrmConnection } from "#runtime/typeorm-connection";
import type {
  CacheStore,
  Field,
  Json,
  Plan,
  Row,
  Selection,
  TrustedContext,
} from "#runtime/persistence.types";

const url = process.env.DRYV_MIGRATION_TEST_URL;
const live = url ? test : test.skip;
const namespace = "dryv_runtime_" + randomUUID().replaceAll("-", "");
const source = new DataSource({ type: "postgres", url });
const field = (name: string, optional = false): Field => ({
  name,
  column: name,
  column_snake: name,
  scalar: "string",
  optional,
  nullable: false,
  array: false,
  geometry: null,
  schema_id: null,
  default: null,
  min_items: null,
  max_items: null,
  min_length: null,
  max_length: null,
  minimum: null,
  maximum: null,
  multiple_of: null,
  patterns: [],
  values: [],
});
const item: Selection = {
  name: "id",
  kind: "field",
  column: { path: [], field: "id" },
  path: [],
  select: [],
  order: [],
  where: [],
};
const context: TrustedContext = {
  principal: "person-a",
  policies: new Map([["policy", { country: "KE", language: "sw" }]]),
};
function base(): Plan {
  return {
    operation: "list",
    store: null,
    required_runtime_features: [],
    schemas: [
      {
        id: "items",
        namespace,
        table: "items",
        fields: [
          field("id"),
          field("country"),
          field("parent"),
          field("label"),
        ],
        checks: [],
      },
    ],
    input: null,
    input_fields: [],
    read: {
      root: "items",
      parameters: [],
      where: [],
      select: [item],
      order: [{ column: { path: [], field: "id" }, direction: "asc" }],
      many: true,
      page: null,
      envelope: null,
      missing: null,
    },
    write: null,
    authenticated: true,
    policies: ["policy"],
    scope: [{ field: "country", policy: "policy", name: "country" }],
    checks: [],
    failures: [],
    transaction: false,
    cache_seconds: null,
    invalidates: [],
  };
}
class MemoryCache implements CacheStore {
  readonly data = new Map<string, string>();
  readonly versions = new Map<string, number>();
  async get(key: string) {
    return this.data.get(key) ?? null;
  }
  async set(key: string, value: string) {
    this.data.set(key, value);
  }
  async version(operation: string) {
    return String(this.versions.get(operation) ?? 0);
  }
  async invalidate(operation: string) {
    this.versions.set(operation, (this.versions.get(operation) ?? 0) + 1);
  }
}
const cache = new MemoryCache();
const runtime = new PersistenceRuntime(
  new TypeOrmConnection(source),
  cache,
  false,
);
beforeAll(async () => {
  if (!url) return;
  await source.initialize();
  await source.query(`CREATE SCHEMA "${namespace}"`);
  await source.query(
    `CREATE TABLE "${namespace}".items(id text PRIMARY KEY,country text NOT NULL,parent text,label text); INSERT INTO "${namespace}".items VALUES ('a','KE',NULL,'root'),('b','KE','a','child'),('c','TZ',NULL,'other'),('x','TZ','a','foreign')`,
  );
});
afterAll(async () => {
  if (!source.isInitialized) return;
  try {
    await source.query(`DROP SCHEMA "${namespace}" CASCADE`);
  } finally {
    await source.destroy();
  }
});
live(
  "scoped reads, counts, paging, arbitrary nested selections and policy failures",
  async () => {
    const plan = base();
    const step = {
      matches: [{ source_field: "country", target_field: "country" }],
      source: "items",
      target: "items",
      source_field: "id",
      target_field: "parent",
      many: true,
      nullable: true,
    };
    let nested: Selection = { ...item };
    for (let level = 0; level < 8; level++)
      nested = {
        ...item,
        name: "children",
        kind: "related",
        column: null,
        path: [step],
        select: [item, nested],
      };
    plan.read!.select = [
      item,
      { ...item, name: "count", kind: "count", column: null, path: [step] },
      nested,
    ];
    plan.read!.page = { limit: "limit", offset: "offset", max_limit: 10 };
    plan.read!.envelope = {
      items: "rows",
      total: "total",
      limit: "limit",
      offset: "offset",
    };
    const result = (await runtime.execute(plan, {}, context)) as Row;
    expect(result.total).toBe(2);
    expect(result.limit).toBe(10);
    const rows = result.items as Row[];
    expect(rows[0]?.count).toBe(1);
    expect((rows[0]?.children as Row[])[0]?.id).toBe("b");
    await expect(
      runtime.execute(plan, {}, { ...context, principal: null }),
    ).rejects.toBeInstanceOf(PersistenceFailure);
    await expect(
      runtime.execute(plan, {}, { ...context, policies: new Map() }),
    ).rejects.toBeInstanceOf(PersistenceFailure);
  },
);
live(
  "TypeORM writes commit, return, patch null/omission, map failures, rollback and invalidate",
  async () => {
    const plan = base();
    plan.operation = "create";
    plan.read = null;
    plan.input_fields = [field("id")];
    plan.invalidates = ["list"];
    plan.write = {
      root: "items",
      kind: "create",
      select: [],
      set: [
        {
          field: "id",
          source: { kind: "input", name: "id", policy: "", value: null },
        },
        {
          field: "label",
          source: { kind: "literal", name: "", policy: "", value: "new" },
        },
      ],
      returning: [item],
      envelope: "item",
      missing: null,
    };
    expect(await runtime.execute(plan, { id: "d" }, context)).toEqual({
      item: { id: "d" },
    });
    expect(await cache.version("list")).toBe("1");
    plan.failures = [
      {
        kind: "unique",
        constraint: null,
        field: null,
        failure: { code: "duplicate", message: "Exists", status: 409 },
      },
    ];
    await expect(
      runtime.execute(plan, { id: "d" }, context),
    ).rejects.toMatchObject({ failure: { code: "duplicate" } });
    expect(await cache.version("list")).toBe("1");
    const update = base();
    update.read = null;
    update.input_fields = [{ ...field("label", true), nullable: true }];
    update.write = {
      root: "items",
      kind: "update",
      select: [
        {
          field: "country",
          source: { kind: "literal", name: "", policy: "", value: "KE" },
        },
      ],
      set: [
        {
          field: "label",
          source: { kind: "input", name: "label", policy: "", value: null },
        },
      ],
      returning: [item],
      envelope: null,
      missing: null,
    };
    await expect(
      runtime.execute(update, { label: "bad" }, context),
    ).rejects.toBeInstanceOf(PersistenceFailure);
    expect(
      (
        await source.query(
          `SELECT label FROM "${namespace}".items WHERE id='a'`,
        )
      )[0]?.label,
    ).toBe("root");
    update.write.select = [
      {
        field: "id",
        source: { kind: "literal", name: "", policy: "", value: "d" },
      },
    ];
    await expect(runtime.execute(update, {}, context)).rejects.toBeInstanceOf(
      PersistenceFailure,
    );
    expect(await runtime.execute(update, { label: null }, context)).toEqual({
      id: "d",
    });
    expect(
      (
        await source.query(
          `SELECT label FROM "${namespace}".items WHERE id='d'`,
        )
      )[0]?.label,
    ).toBeNull();
    update.write.kind = "delete";
    update.write.set = [];
    expect(await runtime.execute(update, {}, context)).toEqual({ id: "d" });
  },
);
live(
  "cache isolates principal, country, language and generation after commit",
  async () => {
    const plan = base();
    plan.cache_seconds = 30;
    await runtime.execute(plan, {}, context);
    const size = cache.data.size;
    await runtime.execute(plan, {}, context);
    expect(cache.data.size).toBe(size);
    await runtime.execute(plan, {}, { ...context, principal: "person-b" });
    await runtime.execute(
      plan,
      {},
      {
        ...context,
        policies: new Map([["policy", { country: "TZ", language: "sw" }]]),
      },
    );
    await runtime.execute(
      plan,
      {},
      {
        ...context,
        policies: new Map([["policy", { country: "KE", language: "en" }]]),
      },
    );
    expect(cache.data.size).toBe(size + 3);
    await cache.invalidate("list");
    await runtime.execute(plan, {}, context);
    expect(cache.data.size).toBe(size + 4);
  },
);
test("database and input boundaries reject non-JSON values", async () => {
  const plan = base();
  plan.authenticated = false;
  plan.policies = [];
  plan.scope = [];
  await expect(
    runtime.execute(plan, { bad: undefined }, context),
  ).rejects.toBeInstanceOf(PersistenceFailure);
});

live(
  "single-result failures and named-input checks cannot bypass trusted scope",
  async () => {
    const plan = base();
    plan.input_fields = [field("id")];
    plan.read!.many = false;
    plan.read!.parameters = [
      {
        name: "id",
        source: { kind: "input", name: "id", policy: "", value: null },
        optional: false,
      },
    ];
    plan.read!.where = [
      {
        column: { path: [], field: "id" },
        operator: "equal",
        parameter: "id",
        is_null: true,
      },
    ];
    plan.read!.missing = { code: "not_found", message: "Missing", status: 404 };
    await expect(
      runtime.execute(plan, { id: "c" }, context),
    ).rejects.toMatchObject({ failure: { code: "not_found" } });
    expect(await runtime.execute(plan, { id: "a" }, context)).toEqual({
      id: "a",
    });
    plan.checks = [
      {
        rule: {
          kind: "compare",
          operator: "equal",
          context: "",
          path: [],
          value: null,
          children: [
            {
              kind: "context",
              context: "id",
              path: [],
              operator: "",
              value: null,
              children: [],
            },
            {
              kind: "literal",
              context: "",
              path: [],
              operator: "",
              value: "a",
              children: [],
            },
          ],
        },
        failure: { code: "invalid_id", message: "Wrong id", status: 422 },
      },
    ];
    await expect(
      runtime.execute(plan, { id: "b" }, context),
    ).rejects.toMatchObject({ failure: { code: "invalid_id" } });
    expect(await runtime.execute(plan, { id: "a" }, context)).toEqual({
      id: "a",
    });
  },
);

live(
  "geometry selections remain GeoJSON through TypeORM persistence",
  async () => {
    await source.query(
      `ALTER TABLE "${namespace}".items ADD COLUMN location geometry(Point,4326)`,
    );
    await source.query(
      `UPDATE "${namespace}".items SET location=ST_SetSRID(ST_MakePoint(36.8,-1.3),4326) WHERE id='a'`,
    );
    const plan = base();
    plan.schemas[0]!.fields.push({
      ...field("location"),
      scalar: "geometry",
      nullable: true,
      geometry: { shape: "point", srid: 4326, dimensions: null },
    });
    plan.read!.select = [
      item,
      { ...item, name: "location", column: { path: [], field: "location" } },
    ];
    const result = (await runtime.execute(plan, {}, context)) as Row[];
    expect(result[0]?.location).toEqual({
      type: "Point",
      coordinates: [36.8, -1.3],
    });
  },
);

live(
  "database defaults and soft-delete assignments use canonical write sources",
  async () => {
    await source.query(
      `ALTER TABLE "${namespace}".items ALTER COLUMN label SET DEFAULT 'defaulted'`,
    );
    const plan = base();
    plan.read = null;
    plan.input_fields = [field("id")];
    plan.write = {
      root: "items",
      kind: "create",
      select: [],
      set: [
        {
          field: "id",
          source: { kind: "input", name: "id", policy: "", value: null },
        },
        {
          field: "label",
          source: { kind: "default", name: "", policy: "", value: null },
        },
      ],
      returning: [
        item,
        { ...item, name: "label", column: { path: [], field: "label" } },
      ],
      envelope: null,
      missing: null,
    };
    expect(await runtime.execute(plan, { id: "default-row" }, context)).toEqual(
      { id: "default-row", label: "defaulted" },
    );
    plan.input_fields = [];
    plan.write.kind = "soft-delete";
    plan.write.select = [
      {
        field: "id",
        source: { kind: "literal", name: "", policy: "", value: "default-row" },
      },
    ];
    plan.write.set = [
      {
        field: "label",
        source: { kind: "literal", name: "", policy: "", value: "removed" },
      },
    ];
    expect(await runtime.execute(plan, {}, context)).toEqual({
      id: "default-row",
      label: "removed",
    });
    plan.write.select[0]!.source.value = "absent";
    plan.write.missing = { code: "missing", message: "Missing", status: 404 };
    await expect(runtime.execute(plan, {}, context)).rejects.toMatchObject({
      failure: { code: "missing" },
    });
  },
);

test("cache transport failure stops a read before database execution", async () => {
  let queried = false;
  const failing: CacheStore = {
    async get() {
      throw new Error("Cache unavailable");
    },
    async set() {},
    async version() {
      return "0";
    },
    async invalidate() {},
  };
  const connection = {
    async query() {
      queried = true;
      return [];
    },
    async transaction<T>(
      work: (connection: { query: () => Promise<unknown> }) => Promise<T>,
    ) {
      return work({ query: async () => [] });
    },
  };
  const runtime = new PersistenceRuntime(connection, failing);
  const plan = base();
  plan.cache_seconds = 30;
  await expect(runtime.execute(plan, {}, context)).rejects.toThrow(
    "Cache unavailable",
  );
  expect(queried).toBe(false);
});

live("named stores require explicitly registered connections", async () => {
  const plan = base();
  plan.store = "main";
  await expect(runtime.execute(plan, {}, context)).rejects.toThrow(
    "StoreConnections",
  );
  const registered = new PersistenceRuntime(
    new StoreConnections(new Map([["main", new TypeOrmConnection(source)]])),
  );
  const result = (await registered.execute(plan, {}, context)) as Row[];
  expect(result[0]?.id).toBe("a");
  plan.store = "other";
  await expect(registered.execute(plan, {}, context)).rejects.toThrow(
    "No explicitly configured connection",
  );
});
