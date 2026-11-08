import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { geoUnitPublicExample } from "#/modules/geography/dto/geo-unit-public.dto.example.ts";

/** The contract shape of GeoUnitResponse, for generated tests. */
export const geoUnitResponseExample: ContractExample = contractExample({
  name: "GeoUnitResponse",
  fields: [
    {
      name: "unit",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => geoUnitPublicExample },
    },
  ],
  invariants: [
  ],
});