import { type ContractExample, contractExample } from "#/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of OfficeDetailHoldersNames, for generated tests. */
export const officeDetailHoldersNamesExample: ContractExample = contractExample({
  name: "OfficeDetailHoldersNames",
  fields: [
    {
      name: "isPreferred",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
  ],
  invariants: [
  ],
});