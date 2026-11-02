import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { amenityPublicExample } from "#/modules/services/dto/amenity-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of AmenitiesListResponse, for generated tests. */
export const amenitiesListResponseExample: ContractExample = contractExample({
  name: "AmenitiesListResponse",
  fields: [
    {
      name: "amenities",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => amenityPublicExample },
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