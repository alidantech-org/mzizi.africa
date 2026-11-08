import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { observationDerivationPublicExample } from "#/modules/statistics/dto/observation-derivation-public.dto.example.ts";

/** The contract shape of ObservationDerivationResponse, for generated tests. */
export const observationDerivationResponseExample: ContractExample = contractExample({
  name: "ObservationDerivationResponse",
  fields: [
    {
      name: "derivation",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => observationDerivationPublicExample },
    },
  ],
  invariants: [
  ],
});