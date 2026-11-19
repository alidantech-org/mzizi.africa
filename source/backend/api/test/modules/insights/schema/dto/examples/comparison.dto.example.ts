import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { comparisonAExample } from "@test/modules/insights/schema/dto/examples/comparison-a.dto.example.ts";
import { comparisonBExample } from "@test/modules/insights/schema/dto/examples/comparison-b.dto.example.ts";
import { comparisonRowsExample } from "@test/modules/insights/schema/dto/examples/comparison-rows.dto.example.ts";

/** The contract shape of Comparison, for generated tests. */
export const comparisonExample: ContractExample = contractExample({
  name: "Comparison",
  fields: [
    {
      name: "a",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => comparisonAExample },
    },
    {
      name: "b",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => comparisonBExample },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "rows",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => comparisonRowsExample },
    },
  ],
  invariants: [],
});
