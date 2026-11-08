import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { seatPublicExample } from "#/modules/elections/dto/seat-public.dto.example.ts";

/** The contract shape of SeatResponse, for generated tests. */
export const seatResponseExample: ContractExample = contractExample({
  name: "SeatResponse",
  fields: [
    {
      name: "seat",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => seatPublicExample },
    },
  ],
  invariants: [
  ],
});