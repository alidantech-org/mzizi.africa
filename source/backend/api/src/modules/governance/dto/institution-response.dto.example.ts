import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { institutionPublicExample } from "#/modules/governance/dto/institution-public.dto.example.ts";

/** The contract shape of InstitutionResponse, for generated tests. */
export const institutionResponseExample: ContractExample = contractExample({
  name: "InstitutionResponse",
  fields: [
    {
      name: "institution",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => institutionPublicExample },
    },
  ],
  invariants: [
  ],
});