import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { releaseEntryExample } from "@test/modules/product/schema/dto/examples/release-entry.dto.example.ts";

/** The contract shape of ReleaseCollection, for generated tests. */
export const releaseCollectionExample: ContractExample = contractExample({
  name: "ReleaseCollection",
  fields: [
    {
      name: "releases",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => releaseEntryExample },
    },
  ],
  invariants: [],
});
