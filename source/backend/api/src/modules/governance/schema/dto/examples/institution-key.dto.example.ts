import { type ContractExample, contractExample } from "#/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of InstitutionKey, for generated tests. */
export const institutionKeyExample: ContractExample = contractExample({
  name: "InstitutionKey",
  fields: [
    {
      name: "institutionId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [
  ],
});