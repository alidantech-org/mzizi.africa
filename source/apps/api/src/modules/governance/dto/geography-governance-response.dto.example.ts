import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { institutionPublicExample } from "#/modules/governance/dto/institution-public.dto.example.ts";
import { officeHolderPublicExample } from "#/modules/governance/dto/office-holder-public.dto.example.ts";
import { officePublicExample } from "#/modules/governance/dto/office-public.dto.example.ts";

/** The contract shape of GeographyGovernanceResponse, for generated tests. */
export const geographyGovernanceResponseExample: ContractExample = contractExample({
  name: "GeographyGovernanceResponse",
  fields: [
    {
      name: "holders",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => officeHolderPublicExample },
    },
    {
      name: "institutions",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => institutionPublicExample },
    },
    {
      name: "offices",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => officePublicExample },
    },
  ],
  invariants: [
  ],
});