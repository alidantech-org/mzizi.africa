import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { dimensionPublicExample } from "#/modules/statistics/dto/dimension-public.dto.example.ts";

/** The contract shape of DimensionResponse, for generated tests. */
export const dimensionResponseExample: ContractExample = contractExample({
  name: "DimensionResponse",
  fields: [
    {
      name: "dimension",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => dimensionPublicExample },
    },
  ],
  invariants: [
  ],
});