import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { geoUnitChangePublicExample } from "#/modules/geography/dto/geo-unit-change-public.dto.example.ts";
import { geoUnitNameVersionPublicExample } from "#/modules/geography/dto/geo-unit-name-version-public.dto.example.ts";

/** The contract shape of GeographyHistoryResponse, for generated tests. */
export const geographyHistoryResponseExample: ContractExample = contractExample({
  name: "GeographyHistoryResponse",
  fields: [
    {
      name: "changes",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => geoUnitChangePublicExample },
    },
    {
      name: "names",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => geoUnitNameVersionPublicExample },
    },
  ],
  invariants: [
  ],
});