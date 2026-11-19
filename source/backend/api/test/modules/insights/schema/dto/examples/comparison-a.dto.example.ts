import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ComparisonA, for generated tests. */
export const comparisonAExample: ContractExample = contractExample({
  name: "ComparisonA",
  fields: [
    {
      name: "featureId",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "kindCode",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "kindLabel",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "path",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
