import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of SeriesInput, for generated tests. */
export const seriesInputExample: ContractExample = contractExample({
  name: "SeriesInput",
  fields: [
    {
      name: "featureId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "indicatorCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 200 },
    },
  ],
  invariants: [],
});
