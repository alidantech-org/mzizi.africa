import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { schemeEntryExample } from "@test/modules/reference/schema/dto/examples/scheme-entry.dto.example.ts";

/** The contract shape of SchemeCollection, for generated tests. */
export const schemeCollectionExample: ContractExample = contractExample({
  name: "SchemeCollection",
  fields: [
    {
      name: "schemes",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => schemeEntryExample },
    },
  ],
  invariants: [],
});
