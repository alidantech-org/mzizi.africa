import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { institutionRelationshipPublicExample } from "#/modules/governance/dto/institution-relationship-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of InstitutionRelationshipsListResponse, for generated tests. */
export const institutionRelationshipsListResponseExample: ContractExample = contractExample({
  name: "InstitutionRelationshipsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "relationships",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => institutionRelationshipPublicExample },
    },
  ],
  invariants: [
  ],
});