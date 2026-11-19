import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of IndicatorSeriesIndicator, for generated tests. */
export const indicatorSeriesIndicatorExample: ContractExample = contractExample({
  name: "IndicatorSeriesIndicator",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "description",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "higherIsBetter",
      optional: true,
      nullable: true,
      spec: { kind: "boolean" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "unit",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
