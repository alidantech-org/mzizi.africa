import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { loanDisbursementPublicExample } from "#/modules/debt/dto/loan-disbursement-public.dto.example.ts";

/** The contract shape of LoanDisbursementResponse, for generated tests. */
export const loanDisbursementResponseExample: ContractExample = contractExample({
  name: "LoanDisbursementResponse",
  fields: [
    {
      name: "disbursement",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => loanDisbursementPublicExample },
    },
  ],
  invariants: [
  ],
});