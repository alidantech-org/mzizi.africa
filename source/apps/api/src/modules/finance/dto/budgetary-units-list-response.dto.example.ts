import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { budgetaryUnitPublicExample } from "#/modules/finance/dto/budgetary-unit-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of BudgetaryUnitsListResponse, for generated tests. */
export const budgetaryUnitsListResponseExample: ContractExample = contractExample({
  name: "BudgetaryUnitsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "units",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => budgetaryUnitPublicExample },
    },
  ],
  invariants: [
  ],
});