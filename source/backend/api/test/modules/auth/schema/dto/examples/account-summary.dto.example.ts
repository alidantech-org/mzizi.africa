import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { AccountStatus } from "#/modules/auth/schema/enum/account-status.enum.ts";
import { AuthActorKind } from "#/modules/auth/schema/enum/auth-actor-kind.enum.ts";

/** The contract shape of AccountSummary, for generated tests. */
export const accountSummaryExample: ContractExample = contractExample({
  name: "AccountSummary",
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
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(AccountStatus) },
    },
  ],
  invariants: [],
});
