import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { loanRepaymentPublicExample } from "#/modules/debt/dto/loan-repayment-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of LoanRepaymentsListResponse, for generated tests. */
export const loanRepaymentsListResponseExample: ContractExample = contractExample({
  name: "LoanRepaymentsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "repayments",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => loanRepaymentPublicExample },
    },
  ],
  invariants: [
  ],
});