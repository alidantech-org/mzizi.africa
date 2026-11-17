import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PositionInput, for generated tests. */
export const positionInputExample: ContractExample = contractExample({
  name: "PositionInput",
  fields: [
    {
      name: "languageCode",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 35 },
    },
    {
      name: "latitude",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: -90, max: 90 },
    },
    {
      name: "longitude",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: -180, max: 180 },
    },
    {
      name: "onDate",
      optional: true,
      nullable: false,
      spec: { kind: "temporal", temporal: "date" },
    },
  ],
  invariants: [],
});
