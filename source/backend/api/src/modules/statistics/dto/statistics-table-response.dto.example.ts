import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { statisticsTablePublicExample } from "#/modules/statistics/dto/statistics-table-public.dto.example.ts";

/** The contract shape of StatisticsTableResponse, for generated tests. */
export const statisticsTableResponseExample: ContractExample = contractExample({
  name: "StatisticsTableResponse",
  fields: [
    {
      name: "table",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => statisticsTablePublicExample },
    },
  ],
  invariants: [
  ],
});