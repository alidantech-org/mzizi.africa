import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { schemeEntryExample } from "#/modules/reference/dto/scheme-entry.dto.example.ts";

/** The contract shape of SchemeCollection, for generated tests. */
export const schemeCollectionExample: ContractExample = contractExample({
  name: "SchemeCollection",
  fields: [
    {
      name: "schemes",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => schemeEntryExample },
    },
  ],
  invariants: [
  ],
});