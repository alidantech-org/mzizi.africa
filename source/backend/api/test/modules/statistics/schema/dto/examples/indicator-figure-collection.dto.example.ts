import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { indicatorFigureEntryExample } from "@test/modules/statistics/schema/dto/examples/indicator-figure-entry.dto.example.ts";

/** The contract shape of IndicatorFigureCollection, for generated tests. */
export const indicatorFigureCollectionExample: ContractExample = contractExample({
  name: "IndicatorFigureCollection",
  fields: [
    {
      name: "figures",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => indicatorFigureEntryExample },
    },
  ],
  invariants: [],
});
