import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of LegalBasisInput, for generated tests. */
export const legalBasisInputExample: ContractExample = contractExample({
  name: "LegalBasisInput",
  fields: [
    {
      name: "subjectCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 200 },
    },
    {
      name: "subjectTable",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
  ],
  invariants: [],
});
