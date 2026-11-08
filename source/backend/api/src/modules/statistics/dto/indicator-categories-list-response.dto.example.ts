import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { indicatorCategoryPublicExample } from "#/modules/statistics/dto/indicator-category-public.dto.example.ts";

/** The contract shape of IndicatorCategoriesListResponse, for generated tests. */
export const indicatorCategoriesListResponseExample: ContractExample = contractExample({
  name: "IndicatorCategoriesListResponse",
  fields: [
    {
      name: "categories",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => indicatorCategoryPublicExample },
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