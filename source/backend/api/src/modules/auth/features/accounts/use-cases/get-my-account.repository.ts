import { Injectable, HttpException, Optional } from "@nestjs/common";
import { plainToInstance, instanceToPlain } from "class-transformer";
import { validateOrReject } from "class-validator";
import {
  PersistenceRuntime,
  PersistenceFailure,
  PersistencePolicyResolver,
} from "#/database/persistence/persistence.runtime";
import type { Plan, TrustedContext } from "#/database/persistence/persistence.types";
import { AccountReadDto } from "#/modules/auth/schema/dto/account-read.dto";
const plan = {
  store: "main",
  operation: "#/operations/auth.GetMyAccount",
  schemas: [
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
          optional: false,
          nullable: false,
          array: false,
          min_items: null,
          max_items: null,
          geometry: null,
          schema_id: null,
          default: null,
          min_length: null,
          max_length: null,
          minimum: null,
          maximum: null,
          multiple_of: null,
          patterns: [],
          values: ["agent", "person", "service"],
        },
        {
          name: "createdAt",
          column: "createdAt",
          column_snake: "created_at",
          scalar: "instant",
          optional: false,
          nullable: false,
          array: false,
          min_items: null,
          max_items: null,
          geometry: null,
          schema_id: null,
          default: null,
          min_length: null,
          max_length: null,
          minimum: null,
          maximum: null,
          multiple_of: null,
          patterns: [],
          values: [],
        },
        {
          name: "disabledAt",
          column: "disabledAt",
          column_snake: "disabled_at",
          scalar: "instant",
          optional: true,
          nullable: true,
          array: false,
          min_items: null,
          max_items: null,
          geometry: null,
          schema_id: null,
          default: null,
          min_length: null,
          max_length: null,
          minimum: null,
          maximum: null,
          multiple_of: null,
          patterns: [],
          values: [],
        },
        {
          name: "displayName",
          column: "displayName",
          column_snake: "display_name",
          scalar: "string",
          optional: false,
          nullable: false,
          array: false,
          min_items: null,
          max_items: null,
          geometry: null,
          schema_id: null,
          default: null,
          min_length: 1,
          max_length: 255,
          minimum: null,
          maximum: null,
          multiple_of: null,
          patterns: [],
          values: [],
        },
        {
          name: "id",
          column: "id",
          column_snake: "id",
          scalar: "uuid",
          optional: false,
          nullable: false,
          array: false,
          min_items: null,
          max_items: null,
          geometry: null,
          schema_id: null,
          default: null,
          min_length: null,
          max_length: null,
          minimum: null,
          maximum: null,
          multiple_of: null,
          patterns: [],
          values: [],
        },
        {
          name: "individualId",
          column: "individualId",
          column_snake: "individual_id",
          scalar: "uuid",
          optional: true,
          nullable: true,
          array: false,
          min_items: null,
          max_items: null,
          geometry: null,
          schema_id: null,
          default: null,
          min_length: null,
          max_length: null,
          minimum: null,
          maximum: null,
          multiple_of: null,
          patterns: [],
          values: [],
        },
        {
          name: "lastAuthenticatedAt",
          column: "lastAuthenticatedAt",
          column_snake: "last_authenticated_at",
          scalar: "instant",
          optional: true,
          nullable: true,
          array: false,
          min_items: null,
          max_items: null,
          geometry: null,
          schema_id: null,
          default: null,
          min_length: null,
          max_length: null,
          minimum: null,
          maximum: null,
          multiple_of: null,
          patterns: [],
          values: [],
        },
        {
          name: "status",
          column: "status",
          column_snake: "status",
          scalar: "string",
          optional: false,
          nullable: false,
          array: false,
          min_items: null,
          max_items: null,
          geometry: null,
          schema_id: null,
          default: null,
          min_length: null,
          max_length: null,
          minimum: null,
          maximum: null,
          multiple_of: null,
          patterns: [],
          values: ["active", "closed", "suspended"],
        },
      ],
      checks: [],
    },
  ],
  input: null,
  input_fields: [],
  read: {
    root: "#/schemas/auth.Accounts",
    parameters: [
      {
        name: "accountId",
        source: {
          kind: "policy",
          name: "accountId",
          policy: "#/policies/auth.SignedIn",
          value: null,
        },
        optional: false,
      },
    ],
    where: [
      {
        column: { path: [], field: "id" },
        operator: "equal",
        parameter: "accountId",
        is_null: true,
      },
    ],
    select: [
      {
        name: "actorKind",
        kind: "field",
        column: { path: [], field: "actorKind" },
        path: [],
        select: [],
        order: [],
        where: [],
      },
      {
        name: "displayName",
        kind: "field",
        column: { path: [], field: "displayName" },
        path: [],
        select: [],
        order: [],
        where: [],
      },
      {
        name: "id",
        kind: "field",
        column: { path: [], field: "id" },
        path: [],
        select: [],
        order: [],
        where: [],
      },
      {
        name: "lastAuthenticatedAt",
        kind: "field",
        column: { path: [], field: "lastAuthenticatedAt" },
        path: [],
        select: [],
        order: [],
        where: [],
      },
      {
        name: "status",
        kind: "field",
        column: { path: [], field: "status" },
        path: [],
        select: [],
        order: [],
        where: [],
      },
    ],
    order: [],
    many: false,
    page: null,
    envelope: null,
    missing: { code: "not_found", message: "The requested resource does not exist.", status: 404 },
  },
  write: null,
  authenticated: true,
  policies: ["#/policies/auth.SignedIn"],
  scope: [],
  checks: [],
  failures: [],
  required_runtime_features: [],
  transaction: false,
  cache_seconds: null,
  invalidates: [],
} satisfies Plan;
/** Named typed repository function; all SQL and transaction handling live in the runtime. */
export async function getMyAccountRepository(
  runtime: PersistenceRuntime,
  input: { [key: string]: never },
  context: TrustedContext,
): Promise<AccountReadDto> {
  try {
    const result = await runtime.execute(plan, instanceToPlain(input), context);
    if (result === null || typeof result !== "object" || Array.isArray(result))
      throw new Error("Expected response object");
    const output = plainToInstance(AccountReadDto, result);
    await validateOrReject(output);
    return output;
  } catch (error) {
    if (error instanceof PersistenceFailure)
      throw new HttpException(
        { code: error.failure.code, message: error.message },
        error.failure.status,
      );
    throw error;
  }
}

/** The application policy resolver supplies trusted context separately from request input. */
@Injectable()
export class GetMyAccountUseCase {
  /** Optional so HTTP specs can mock the service without a database; the application registers both globally. */
  constructor(
    @Optional() private readonly runtime?: PersistenceRuntime,
    @Optional() private readonly policyResolver?: PersistencePolicyResolver,
  ) {}
  async execute(
    input: { [key: string]: never } = {},
    context?: TrustedContext,
  ): Promise<AccountReadDto> {
    if (!this.runtime || !this.policyResolver)
      throw new Error("PersistenceRuntime and PersistencePolicyResolver must be registered");
    return getMyAccountRepository(
      this.runtime,
      input,
      context ?? (await this.policyResolver.resolve(plan.operation)),
    );
  }
}
