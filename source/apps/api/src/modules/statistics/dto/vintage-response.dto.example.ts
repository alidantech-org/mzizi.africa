import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { vintagePublicExample } from "#/modules/statistics/dto/vintage-public.dto.example.ts";

/** The contract shape of VintageResponse, for generated tests. */
export const vintageResponseExample: ContractExample = contractExample({
  name: "VintageResponse",
  fields: [
    {
      name: "vintage",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => vintagePublicExample },
    },
  ],
  invariants: [
  ],
});