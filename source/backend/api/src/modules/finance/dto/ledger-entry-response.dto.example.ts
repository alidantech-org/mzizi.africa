import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { ledgerEntryPublicExample } from "#/modules/finance/dto/ledger-entry-public.dto.example.ts";

/** The contract shape of LedgerEntryResponse, for generated tests. */
export const ledgerEntryResponseExample: ContractExample = contractExample({
  name: "LedgerEntryResponse",
  fields: [
    {
      name: "entry",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => ledgerEntryPublicExample },
    },
  ],
  invariants: [
  ],
});