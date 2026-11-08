import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { transferPublicExample } from "#/modules/finance/dto/transfer-public.dto.example.ts";

/** The contract shape of TransferResponse, for generated tests. */
export const transferResponseExample: ContractExample = contractExample({
  name: "TransferResponse",
  fields: [
    {
      name: "transfer",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => transferPublicExample },
    },
  ],
  invariants: [
  ],
});