import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { budgetaryUnitPublicExample } from "#/modules/finance/dto/budgetary-unit-public.dto.example.ts";

/** The contract shape of BudgetaryUnitResponse, for generated tests. */
export const budgetaryUnitResponseExample: ContractExample = contractExample({
  name: "BudgetaryUnitResponse",
  fields: [
    {
      name: "unit",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => budgetaryUnitPublicExample },
    },
  ],
  invariants: [
  ],
});