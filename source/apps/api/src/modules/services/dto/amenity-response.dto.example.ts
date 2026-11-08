import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { amenityPublicExample } from "#/modules/services/dto/amenity-public.dto.example.ts";

/** The contract shape of AmenityResponse, for generated tests. */
export const amenityResponseExample: ContractExample = contractExample({
  name: "AmenityResponse",
  fields: [
    {
      name: "amenity",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => amenityPublicExample },
    },
  ],
  invariants: [
  ],
});