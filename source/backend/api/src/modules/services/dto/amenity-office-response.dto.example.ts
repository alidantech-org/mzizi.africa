import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { amenityOfficePublicExample } from "#/modules/services/dto/amenity-office-public.dto.example.ts";

/** The contract shape of AmenityOfficeResponse, for generated tests. */
export const amenityOfficeResponseExample: ContractExample = contractExample({
  name: "AmenityOfficeResponse",
  fields: [
    {
      name: "amenityOffice",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => amenityOfficePublicExample },
    },
  ],
  invariants: [
  ],
});