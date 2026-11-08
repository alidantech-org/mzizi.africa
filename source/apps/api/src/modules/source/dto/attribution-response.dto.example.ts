import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { attributionPublicExample } from "#/modules/source/dto/attribution-public.dto.example.ts";

/** The contract shape of AttributionResponse, for generated tests. */
export const attributionResponseExample: ContractExample = contractExample({
  name: "AttributionResponse",
  fields: [
    {
      name: "attribution",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => attributionPublicExample },
    },
  ],
  invariants: [
  ],
});