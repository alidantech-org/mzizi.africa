import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { seatPublicExample } from "#/modules/elections/dto/seat-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of SeatsListResponse, for generated tests. */
export const seatsListResponseExample: ContractExample = contractExample({
  name: "SeatsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "seats",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => seatPublicExample },
    },
  ],
  invariants: [
  ],
});