import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PlaceOnly, for generated tests. */
export const placeOnlyExample: ContractExample = contractExample({
  name: "PlaceOnly",
  fields: [
    {
      name: "featureId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [],
});
