import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of StructureDocumentInstitutionsNames, for generated tests. */
export const structureDocumentInstitutionsNamesExample: ContractExample = contractExample({
  name: "StructureDocumentInstitutionsNames",
  fields: [
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "preferred",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
  ],
  invariants: [],
});
