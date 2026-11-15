import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { memberEntryExample } from "@test/modules/reference/schema/dto/examples/member-entry.dto.example.ts";

/** The contract shape of MemberCollection, for generated tests. */
export const memberCollectionExample: ContractExample = contractExample({
  name: "MemberCollection",
  fields: [
    {
      name: "values",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => memberEntryExample },
    },
  ],
  invariants: [],
});
