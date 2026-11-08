import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { seatAllocationPublicExample } from "#/modules/elections/dto/seat-allocation-public.dto.example.ts";

/** The contract shape of SeatAllocationResponse, for generated tests. */
export const seatAllocationResponseExample: ContractExample = contractExample({
  name: "SeatAllocationResponse",
  fields: [
    {
      name: "allocation",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => seatAllocationPublicExample },
    },
  ],
  invariants: [
  ],
});