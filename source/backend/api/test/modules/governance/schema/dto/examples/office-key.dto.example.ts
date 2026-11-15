import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of OfficeKey, for generated tests. */
export const officeKeyExample: ContractExample = contractExample({
  name: "OfficeKey",
  fields: [
    {
      name: "officeId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [],
});
