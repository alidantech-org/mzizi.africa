import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { fiscalYearPublicExample } from "#/modules/finance/dto/fiscal-year-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of FiscalYearsListResponse, for generated tests. */
export const fiscalYearsListResponseExample: ContractExample = contractExample({
  name: "FiscalYearsListResponse",
  fields: [
    {
      name: "fiscalYears",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => fiscalYearPublicExample },
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