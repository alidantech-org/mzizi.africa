import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { loanPublicExample } from "#/modules/debt/dto/loan-public.dto.example.ts";

/** The contract shape of LoanResponse, for generated tests. */
export const loanResponseExample: ContractExample = contractExample({
  name: "LoanResponse",
  fields: [
    {
      name: "loan",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => loanPublicExample },
    },
  ],
  invariants: [
  ],
});