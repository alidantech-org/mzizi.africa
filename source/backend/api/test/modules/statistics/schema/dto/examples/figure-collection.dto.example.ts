import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { figureEntryExample } from "@test/modules/statistics/schema/dto/examples/figure-entry.dto.example.ts";

/** The contract shape of FigureCollection, for generated tests. */
export const figureCollectionExample: ContractExample = contractExample({
  name: "FigureCollection",
  fields: [
    {
      name: "figures",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => figureEntryExample },
    },
  ],
  invariants: [],
});
