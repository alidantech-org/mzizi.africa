import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of IndicatorMapIndicator, for generated tests. */
export const indicatorMapIndicatorExample: ContractExample = contractExample({
  name: "IndicatorMapIndicator",
  fields: [
    {
      name: "code",
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
