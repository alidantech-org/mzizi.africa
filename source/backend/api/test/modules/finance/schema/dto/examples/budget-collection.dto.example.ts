import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { budgetEntryExample } from "@test/modules/finance/schema/dto/examples/budget-entry.dto.example.ts";

/** The contract shape of BudgetCollection, for generated tests. */
export const budgetCollectionExample: ContractExample = contractExample({
  name: "BudgetCollection",
  fields: [
    {
      name: "budgets",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => budgetEntryExample },
    },
  ],
  invariants: [],
});
