import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ViewInput, for generated tests. */
export const viewInputExample: ContractExample = contractExample({
  name: "ViewInput",
  fields: [
    {
      name: "subjectRef",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 200 },
    },
    {
      name: "subjectTable",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 3, maxLength: 100 },
    },
    {
      name: "visitor",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 600 },
    },
  ],
  invariants: [],
});
