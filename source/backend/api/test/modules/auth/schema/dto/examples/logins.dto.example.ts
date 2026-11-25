import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { LoginKind } from "#/modules/auth/schema/enum/login-kind.enum.ts";
import { accountsExample } from "@test/modules/auth/schema/dto/examples/accounts.dto.example.ts";
import { identifiedExample } from "@test/modules/shared/schema/dto/examples/identified.dto.example.ts";

/** The contract shape of Logins, for generated tests. */
export const loginsExample: ContractExample = contractExample({
  name: "Logins",
  fields: [
    {
      name: "accountId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "issuer",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(LoginKind) },
    },
    {
      name: "lastAuthenticatedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "linkedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "subject",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "unlinkedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "value",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 3, maxLength: 320 },
    },
    {
      name: "verifiedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
  ],
  invariants: [
    {
      any: true,
      comparisons: [
        {
          left: { field: "kind" },
          operator: "equal",
          right: { literal: "oidc" },
        },
        {
          left: { field: "value" },
          operator: "not-equal",
          right: { literal: null },
        },
      ],
    },
  ],
});
