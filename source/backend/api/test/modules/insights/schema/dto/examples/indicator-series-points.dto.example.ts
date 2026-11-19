import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of IndicatorSeriesPoints, for generated tests. */
export const indicatorSeriesPointsExample: ContractExample = contractExample({
  name: "IndicatorSeriesPoints",
  fields: [
    {
      name: "estimated",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "period",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "value",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
