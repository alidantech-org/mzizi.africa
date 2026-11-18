import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of LegalBasis, for generated tests. */
export const legalBasisExample: ContractExample = contractExample({
  name: "LegalBasis",
  fields: [
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "items",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "subject",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
  ],
  invariants: [],
});
