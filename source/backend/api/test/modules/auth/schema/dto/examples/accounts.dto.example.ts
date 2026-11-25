import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { AccountStatus } from "#/modules/auth/schema/enum/account-status.enum.ts";
import { AuthActorKind } from "#/modules/auth/schema/enum/auth-actor-kind.enum.ts";
import { individualsExample } from "@test/modules/official/schema/dto/examples/individuals.dto.example.ts";
import { createdExample } from "@test/modules/shared/schema/dto/examples/created.dto.example.ts";

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
      name: "individualId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "lastAuthenticatedAt",
      optional: true,
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
  invariants: [],
});
