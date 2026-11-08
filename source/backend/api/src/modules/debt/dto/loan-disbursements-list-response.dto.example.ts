import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { loanDisbursementPublicExample } from "#/modules/debt/dto/loan-disbursement-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of LoanDisbursementsListResponse, for generated tests. */
export const loanDisbursementsListResponseExample: ContractExample = contractExample({
  name: "LoanDisbursementsListResponse",
  fields: [
    {
      name: "disbursements",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => loanDisbursementPublicExample },
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