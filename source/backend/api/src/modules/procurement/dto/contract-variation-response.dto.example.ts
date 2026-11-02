import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { contractVariationPublicExample } from "#/modules/procurement/dto/contract-variation-public.dto.example.ts";

/** The contract shape of ContractVariationResponse, for generated tests. */
export const contractVariationResponseExample: ContractExample = contractExample({
  name: "ContractVariationResponse",
  fields: [
    {
      name: "variation",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => contractVariationPublicExample },
    },
  ],
  invariants: [
  ],
});