import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { budgetPublicExample } from "#/modules/finance/dto/budget-public.dto.example.ts";

/** The contract shape of BudgetResponse, for generated tests. */
export const budgetResponseExample: ContractExample = contractExample({
  name: "BudgetResponse",
  fields: [
    {
      name: "budget",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => budgetPublicExample },
    },
  ],
  invariants: [
  ],
});