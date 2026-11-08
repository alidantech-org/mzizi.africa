import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { bidPublicExample } from "#/modules/procurement/dto/bid-public.dto.example.ts";

/** The contract shape of BidResponse, for generated tests. */
export const bidResponseExample: ContractExample = contractExample({
  name: "BidResponse",
  fields: [
    {
      name: "bid",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => bidPublicExample },
    },
  ],
  invariants: [
  ],
});