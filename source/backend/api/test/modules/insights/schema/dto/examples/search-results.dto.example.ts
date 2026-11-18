import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { searchHitExample } from "@test/modules/insights/schema/dto/examples/search-hit.dto.example.ts";

/** The contract shape of SearchResults, for generated tests. */
export const searchResultsExample: ContractExample = contractExample({
  name: "SearchResults",
  fields: [
    {
      name: "counts",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
    {
      name: "hits",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => searchHitExample },
    },
    {
      name: "query",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "total",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
  ],
  invariants: [],
});
