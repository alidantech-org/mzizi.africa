import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { observationPublicExample } from "#/modules/statistics/dto/observation-public.dto.example.ts";

/** The contract shape of ObservationResponse, for generated tests. */
export const observationResponseExample: ContractExample = contractExample({
  name: "ObservationResponse",
  fields: [
    {
      name: "observation",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => observationPublicExample },
    },
  ],
  invariants: [
  ],
});