import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of IndicatorDetailDimensions, for generated tests. */
export const indicatorDetailDimensionsExample: ContractExample = contractExample({
  name: "IndicatorDetailDimensions",
  fields: [
    {
      name: "isRequired",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "position",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "schemeId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [],
});
