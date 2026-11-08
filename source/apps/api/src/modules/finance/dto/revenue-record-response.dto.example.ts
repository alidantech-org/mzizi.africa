import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { revenueRecordPublicExample } from "#/modules/finance/dto/revenue-record-public.dto.example.ts";

/** The contract shape of RevenueRecordResponse, for generated tests. */
export const revenueRecordResponseExample: ContractExample = contractExample({
  name: "RevenueRecordResponse",
  fields: [
    {
      name: "revenue",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => revenueRecordPublicExample },
    },
  ],
  invariants: [
  ],
});