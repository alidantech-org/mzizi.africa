import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of InstitutionDetailMetrics, for generated tests. */
export const institutionDetailMetricsExample: ContractExample = contractExample({
  name: "InstitutionDetailMetrics",
  fields: [
    {
      name: "label",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
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
