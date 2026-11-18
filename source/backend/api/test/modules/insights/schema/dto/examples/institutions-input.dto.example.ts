import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of InstitutionsInput, for generated tests. */
export const institutionsInputExample: ContractExample = contractExample({
  name: "InstitutionsInput",
  fields: [
    {
      name: "armCode",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 200 },
    },
    {
      name: "kindCode",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 200 },
    },
    {
      name: "query",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
  ],
  invariants: [],
});
