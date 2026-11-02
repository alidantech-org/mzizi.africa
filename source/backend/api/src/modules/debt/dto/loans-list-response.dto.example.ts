import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { loanPublicExample } from "#/modules/debt/dto/loan-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of LoansListResponse, for generated tests. */
export const loansListResponseExample: ContractExample = contractExample({
  name: "LoansListResponse",
  fields: [
    {
      name: "loans",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => loanPublicExample },
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