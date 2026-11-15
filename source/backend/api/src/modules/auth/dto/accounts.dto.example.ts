import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { AccountStatus } from "#/modules/auth/account-status.enum.ts";
import { AuthActorKind } from "#/modules/auth/auth-actor-kind.enum.ts";

/** The contract shape of Accounts, for generated tests. */
export const accountsExample: ContractExample = contractExample({
  name: "Accounts",
  fields: [
    {
      name: "actorKind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(AuthActorKind) },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "disabledAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "displayName",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "lastAuthenticatedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "personRefId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(AccountStatus) },
    },
  ],
  invariants: [
  ],
});