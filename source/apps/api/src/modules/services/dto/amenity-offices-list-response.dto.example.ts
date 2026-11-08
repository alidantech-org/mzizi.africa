import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { amenityOfficePublicExample } from "#/modules/services/dto/amenity-office-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of AmenityOfficesListResponse, for generated tests. */
export const amenityOfficesListResponseExample: ContractExample = contractExample({
  name: "AmenityOfficesListResponse",
  fields: [
    {
      name: "amenityOffices",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => amenityOfficePublicExample },
    },
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
  ],
  invariants: [
  ],
});