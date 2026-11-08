import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { indicatorCategoryPublicExample } from "#/modules/statistics/dto/indicator-category-public.dto.example.ts";

/** The contract shape of IndicatorCategoryResponse, for generated tests. */
export const indicatorCategoryResponseExample: ContractExample = contractExample({
  name: "IndicatorCategoryResponse",
  fields: [
    {
      name: "category",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => indicatorCategoryPublicExample },
    },
  ],
  invariants: [
  ],
});