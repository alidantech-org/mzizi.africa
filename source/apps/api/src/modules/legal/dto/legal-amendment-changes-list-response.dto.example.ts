import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { legalAmendmentChangePublicExample } from "#/modules/legal/dto/legal-amendment-change-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of LegalAmendmentChangesListResponse, for generated tests. */
export const legalAmendmentChangesListResponseExample: ContractExample = contractExample({
  name: "LegalAmendmentChangesListResponse",
  fields: [
    {
      name: "changes",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => legalAmendmentChangePublicExample },
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