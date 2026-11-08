import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { tenderPublicExample } from "#/modules/procurement/dto/tender-public.dto.example.ts";

/** The contract shape of TenderResponse, for generated tests. */
export const tenderResponseExample: ContractExample = contractExample({
  name: "TenderResponse",
  fields: [
    {
      name: "tender",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => tenderPublicExample },
    },
  ],
  invariants: [
  ],
});