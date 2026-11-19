import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PlaceStatisticsBreakdownsLanguage, for generated tests. */
export const placeStatisticsBreakdownsLanguageExample: ContractExample = contractExample({
  name: "PlaceStatisticsBreakdownsLanguage",
  fields: [
    {
      name: "label",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "share",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
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
