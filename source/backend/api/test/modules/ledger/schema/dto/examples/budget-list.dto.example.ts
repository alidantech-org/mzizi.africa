import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { budgetExample } from "@test/modules/ledger/schema/dto/examples/budget.dto.example.ts";

/** The contract shape of BudgetList, for generated tests. */
export const budgetListExample: ContractExample = contractExample({
  name: "BudgetList",
  fields: [
    {
      name: "budgets",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => budgetExample },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
  ],
  invariants: [],
});
