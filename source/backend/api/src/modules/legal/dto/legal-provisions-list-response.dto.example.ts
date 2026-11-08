import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { legalProvisionPublicExample } from "#/modules/legal/dto/legal-provision-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of LegalProvisionsListResponse, for generated tests. */
export const legalProvisionsListResponseExample: ContractExample = contractExample({
  name: "LegalProvisionsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "provisions",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => legalProvisionPublicExample },
    },
  ],
  invariants: [
  ],
});