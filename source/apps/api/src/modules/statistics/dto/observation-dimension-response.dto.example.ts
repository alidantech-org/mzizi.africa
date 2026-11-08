import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { observationDimensionPublicExample } from "#/modules/statistics/dto/observation-dimension-public.dto.example.ts";

/** The contract shape of ObservationDimensionResponse, for generated tests. */
export const observationDimensionResponseExample: ContractExample = contractExample({
  name: "ObservationDimensionResponse",
  fields: [
    {
      name: "observationDimension",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => observationDimensionPublicExample },
    },
  ],
  invariants: [
  ],
});