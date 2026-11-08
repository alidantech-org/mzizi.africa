import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { budgetPublicExample } from "#/modules/finance/dto/budget-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of BudgetsListResponse, for generated tests. */
export const budgetsListResponseExample: ContractExample = contractExample({
  name: "BudgetsListResponse",
  fields: [
    {
      name: "budgets",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => budgetPublicExample },
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