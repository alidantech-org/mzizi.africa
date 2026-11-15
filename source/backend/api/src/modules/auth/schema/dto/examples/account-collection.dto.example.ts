import { type ContractExample, contractExample } from "#/modules/common/schema/dto/testing/examples.ts";
import { accountSummaryExample } from "#/modules/auth/schema/dto/examples/account-summary.dto.example.ts";

/** The contract shape of AccountCollection, for generated tests. */
export const accountCollectionExample: ContractExample = contractExample({
  name: "AccountCollection",
  fields: [
    {
      name: "accounts",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => accountSummaryExample },
    },
  ],
  invariants: [
  ],
});