import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { provisionEntryExample } from "@test/modules/legal/schema/dto/examples/provision-entry.dto.example.ts";

/** The contract shape of ProvisionCollection, for generated tests. */
export const provisionCollectionExample: ContractExample = contractExample({
  name: "ProvisionCollection",
  fields: [
    {
      name: "provisions",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => provisionEntryExample },
    },
  ],
  invariants: [],
});
