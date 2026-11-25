import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { indicatorEntryExample } from "@test/modules/statistics/schema/dto/examples/indicator-entry.dto.example.ts";

/** The contract shape of IndicatorCollection, for generated tests. */
export const indicatorCollectionExample: ContractExample = contractExample({
  name: "IndicatorCollection",
  fields: [
    {
      name: "indicators",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => indicatorEntryExample },
    },
  ],
  invariants: [],
});
