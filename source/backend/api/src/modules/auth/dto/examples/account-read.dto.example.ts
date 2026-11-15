import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { AccountStatus } from "#/modules/auth/enum/account-status.enum.ts";
import { AuthActorKind } from "#/modules/auth/enum/auth-actor-kind.enum.ts";

/** The contract shape of AccountRead, for generated tests. */
export const accountReadExample: ContractExample = contractExample({
  name: "AccountRead",
  fields: [
    {
      name: "actorKind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(AuthActorKind) },
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
      optional: false,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
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