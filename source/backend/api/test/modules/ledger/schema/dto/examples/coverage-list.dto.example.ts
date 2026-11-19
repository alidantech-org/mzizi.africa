import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { coverageItemExample } from "@test/modules/ledger/schema/dto/examples/coverage-item.dto.example.ts";

/** The contract shape of CoverageList, for generated tests. */
export const coverageListExample: ContractExample = contractExample({
  name: "CoverageList",
  fields: [
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "items",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => coverageItemExample },
    },
  ],
  invariants: [],
});
