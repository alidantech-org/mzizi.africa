import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeCrumbExample } from "@test/modules/insights/schema/dto/examples/place-crumb.dto.example.ts";

/** The contract shape of IndicatorSeries, for generated tests. */
export const indicatorSeriesExample: ContractExample = contractExample({
  name: "IndicatorSeries",
  fields: [
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "indicator",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
    {
      name: "place",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => placeCrumbExample },
    },
    {
      name: "points",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
  ],
  invariants: [],
});
