import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { seatAllocationPublicExample } from "#/modules/elections/dto/seat-allocation-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of SeatAllocationsListResponse, for generated tests. */
export const seatAllocationsListResponseExample: ContractExample = contractExample({
  name: "SeatAllocationsListResponse",
  fields: [
    {
      name: "allocations",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => seatAllocationPublicExample },
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