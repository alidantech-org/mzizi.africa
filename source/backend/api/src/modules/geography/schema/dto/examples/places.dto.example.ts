import { type ContractExample, contractExample } from "#/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of Places, for generated tests. */
export const placesExample: ContractExample = contractExample({
  name: "Places",
  fields: [
    {
      name: "featureId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "isInhabited",
      optional: true,
      nullable: true,
      spec: { kind: "boolean" },
    },
  ],
  invariants: [
  ],
});