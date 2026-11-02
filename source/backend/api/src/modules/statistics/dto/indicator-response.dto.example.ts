import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { indicatorPublicExample } from "#/modules/statistics/dto/indicator-public.dto.example.ts";

/** The contract shape of IndicatorResponse, for generated tests. */
export const indicatorResponseExample: ContractExample = contractExample({
  name: "IndicatorResponse",
  fields: [
    {
      name: "indicator",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => indicatorPublicExample },
    },
  ],
  invariants: [
  ],
});