import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PlaceInput, for generated tests. */
export const placeInputExample: ContractExample = contractExample({
  name: "PlaceInput",
  fields: [
    {
      name: "featureId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "languageCode",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 35 },
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
