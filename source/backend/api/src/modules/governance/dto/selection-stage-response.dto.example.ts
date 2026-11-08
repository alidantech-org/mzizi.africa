import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { selectionStagePublicExample } from "#/modules/governance/dto/selection-stage-public.dto.example.ts";

/** The contract shape of SelectionStageResponse, for generated tests. */
export const selectionStageResponseExample: ContractExample = contractExample({
  name: "SelectionStageResponse",
  fields: [
    {
      name: "stage",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => selectionStagePublicExample },
    },
  ],
  invariants: [
  ],
});