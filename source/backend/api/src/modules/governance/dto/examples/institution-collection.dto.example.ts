import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { institutionEntryExample } from "#/modules/governance/dto/examples/institution-entry.dto.example.ts";

/** The contract shape of InstitutionCollection, for generated tests. */
export const institutionCollectionExample: ContractExample = contractExample({
  name: "InstitutionCollection",
  fields: [
    {
      name: "institutions",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => institutionEntryExample },
    },
  ],
  invariants: [
  ],
});