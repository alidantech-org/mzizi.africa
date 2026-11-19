import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of CompareOptionsMetrics, for generated tests. */
export const compareOptionsMetricsExample: ContractExample = contractExample({
  name: "CompareOptionsMetrics",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "describe",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "domain",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
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
