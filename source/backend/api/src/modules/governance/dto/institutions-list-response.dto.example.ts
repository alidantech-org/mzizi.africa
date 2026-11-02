import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { institutionPublicExample } from "#/modules/governance/dto/institution-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of InstitutionsListResponse, for generated tests. */
export const institutionsListResponseExample: ContractExample = contractExample({
  name: "InstitutionsListResponse",
  fields: [
    {
      name: "institutions",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => institutionPublicExample },
    },
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
  ],
  invariants: [
  ],
});