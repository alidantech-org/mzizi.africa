import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { institutionRelationshipPublicExample } from "#/modules/governance/dto/institution-relationship-public.dto.example.ts";

/** The contract shape of InstitutionRelationshipResponse, for generated tests. */
export const institutionRelationshipResponseExample: ContractExample = contractExample({
  name: "InstitutionRelationshipResponse",
  fields: [
    {
      name: "relationship",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => institutionRelationshipPublicExample },
    },
  ],
  invariants: [
  ],
});