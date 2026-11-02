import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { indicatorColumnPublicExample } from "#/modules/statistics/dto/indicator-column-public.dto.example.ts";

/** The contract shape of IndicatorColumnResponse, for generated tests. */
export const indicatorColumnResponseExample: ContractExample = contractExample({
  name: "IndicatorColumnResponse",
  fields: [
    {
      name: "column",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => indicatorColumnPublicExample },
    },
  ],
  invariants: [
  ],
});