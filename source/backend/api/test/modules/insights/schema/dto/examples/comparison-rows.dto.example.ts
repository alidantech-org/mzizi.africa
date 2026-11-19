import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ComparisonRows, for generated tests. */
export const comparisonRowsExample: ContractExample = contractExample({
  name: "ComparisonRows",
  fields: [
    {
      name: "a",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "b",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "diffPercent",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "higherIsBetter",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "title",
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
