import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { periodPublicExample } from "#/modules/statistics/dto/period-public.dto.example.ts";

/** The contract shape of PeriodResponse, for generated tests. */
export const periodResponseExample: ContractExample = contractExample({
  name: "PeriodResponse",
  fields: [
    {
      name: "period",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => periodPublicExample },
    },
  ],
  invariants: [
  ],
});