import type { Plan } from "#/database/persistence/persistence.types";

/** Clean config: operation ListAccounts reads Accounts paged by window (limit, offset, status filter) */
export const LIST_ACCOUNTS_PLAN = {
  store: "main",
  operation: "#/operations/auth.ListAccounts",
  schemas: [
    {
      id: "#/schemas/auth.AccountWindow",
      namespace: "auth",
      table: null,
      fields: [
        {
          name: "limit",
          column: "limit",
          column_snake: "limit",
          scalar: "integer",
          optional: true,
          default: 50,
        },
        {
          name: "offset",
          column: "offset",
          column_snake: "offset",
          scalar: "integer",
          optional: true,
          default: 0,
        },
        {
          name: "status",
          column: "status",
          column_snake: "status",
          scalar: "string",
          optional: true,
          values: ["active", "closed", "suspended"],
        },
      ],
      checks: [],
    },
    {
      id: "#/schemas/auth.Accounts",
      namespace: "auth",
      table: "accounts",
      fields: [
        {
          name: "actorKind",
          column: "actorKind",
          column_snake: "actor_kind",
          scalar: "string",
          values: ["agent", "person", "service"],
        },
        {
          name: "createdAt",
          column: "createdAt",
          column_snake: "created_at",
          scalar: "instant",
        },
        {
          name: "disabledAt",
          column: "disabledAt",
          column_snake: "disabled_at",
          scalar: "instant",
          optional: true,
          nullable: true,
        },
        {
          name: "displayName",
          column: "displayName",
          column_snake: "display_name",
          scalar: "string",
          min_length: 1,
          max_length: 255,
        },
        {
          name: "id",
          column: "id",
          column_snake: "id",
          scalar: "uuid",
        },
        {
          name: "individualId",
          column: "individualId",
          column_snake: "individual_id",
          scalar: "uuid",
          optional: true,
          nullable: true,
        },
        {
          name: "lastAuthenticatedAt",
          column: "lastAuthenticatedAt",
          column_snake: "last_authenticated_at",
          scalar: "instant",
          optional: true,
          nullable: true,
        },
        {
          name: "status",
          column: "status",
          column_snake: "status",
          scalar: "string",
          values: ["active", "closed", "suspended"],
        },
      ],
      checks: [],
    },
  ],
  input: "#/schemas/auth.AccountWindow",
  input_fields: [
    {
      name: "limit",
      column: "limit",
      column_snake: "limit",
      scalar: "integer",
      optional: true,
      default: 50,
    },
    {
      name: "offset",
      column: "offset",
      column_snake: "offset",
      scalar: "integer",
      optional: true,
      default: 0,
    },
    {
      name: "status",
      column: "status",
      column_snake: "status",
      scalar: "string",
      optional: true,
      values: ["active", "closed", "suspended"],
    },
  ],
  read: {
    root: "#/schemas/auth.Accounts",
    parameters: [
      {
        name: "limit",
        source: { kind: "input", name: "limit", policy: "", value: null },
        optional: true,
      },
      {
        name: "offset",
        source: { kind: "input", name: "offset", policy: "", value: null },
        optional: true,
      },
      {
        name: "status",
        source: { kind: "input", name: "status", policy: "", value: null },
        optional: true,
      },
    ],
    where: [
      {
        column: { path: [], field: "status" },
        operator: "equal",
        parameter: "status",
        is_null: true,
      },
    ],
    select: [
      {
        name: "actorKind",
        kind: "field",
        column: { path: [], field: "actorKind" },
      },
      {
        name: "displayName",
        kind: "field",
        column: { path: [], field: "displayName" },
      },
      {
        name: "id",
        kind: "field",
        column: { path: [], field: "id" },
      },
      {
        name: "status",
        kind: "field",
        column: { path: [], field: "status" },
      },
    ],
    order: [
      { column: { path: [], field: "displayName" }, direction: "asc" },
      { column: { path: [], field: "id" }, direction: "asc" },
    ],
    many: true,
    page: { limit: "limit", offset: "offset", max_limit: 200 },
    envelope: { accounts: "rows" },
  },
  authenticated: true,
  policies: ["#/policies/auth.PlatformAdmin"],
} satisfies Plan;
