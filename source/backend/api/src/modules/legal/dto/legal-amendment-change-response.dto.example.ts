import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { legalAmendmentChangePublicExample } from "#/modules/legal/dto/legal-amendment-change-public.dto.example.ts";

/** The contract shape of LegalAmendmentChangeResponse, for generated tests. */
export const legalAmendmentChangeResponseExample: ContractExample = contractExample({
  name: "LegalAmendmentChangeResponse",
  fields: [
    {
      name: "change",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => legalAmendmentChangePublicExample },
    },
  ],
  invariants: [
  ],
});