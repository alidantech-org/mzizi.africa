import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { officeHolderPublicExample } from "#/modules/governance/dto/office-holder-public.dto.example.ts";

/** The contract shape of OfficeHolderResponse, for generated tests. */
export const officeHolderResponseExample: ContractExample = contractExample({
  name: "OfficeHolderResponse",
  fields: [
    {
      name: "holder",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => officeHolderPublicExample },
    },
  ],
  invariants: [
  ],
});