import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { loanRepaymentPublicExample } from "#/modules/debt/dto/loan-repayment-public.dto.example.ts";

/** The contract shape of LoanRepaymentResponse, for generated tests. */
export const loanRepaymentResponseExample: ContractExample = contractExample({
  name: "LoanRepaymentResponse",
  fields: [
    {
      name: "repayment",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => loanRepaymentPublicExample },
    },
  ],
  invariants: [
  ],
});