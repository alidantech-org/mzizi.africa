import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { searchHitExample } from "@test/modules/frontend/schema/dto/examples/search-hit.dto.example.ts";

/** The contract shape of SearchResults, for generated tests. */
export const searchResultsExample: ContractExample = contractExample({
  name: "SearchResults",
  fields: [
    {
      name: "hits",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => searchHitExample },
    },
    {
      name: "language",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
  ],
  invariants: [],
});
