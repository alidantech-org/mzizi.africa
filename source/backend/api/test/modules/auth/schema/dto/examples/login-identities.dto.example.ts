import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { accountsExample } from "@test/modules/auth/schema/dto/examples/accounts.dto.example.ts";
import { identifiedExample } from "@test/modules/shared/schema/dto/examples/identified.dto.example.ts";

/** The contract shape of LoginIdentities, for generated tests. */
export const loginIdentitiesExample: ContractExample = contractExample({
  name: "LoginIdentities",
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
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 500 },
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
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "unlinkedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
  ],
  invariants: [],
});
