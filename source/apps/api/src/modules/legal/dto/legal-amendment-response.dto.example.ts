import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { legalAmendmentPublicExample } from "#/modules/legal/dto/legal-amendment-public.dto.example.ts";

/** The contract shape of LegalAmendmentResponse, for generated tests. */
export const legalAmendmentResponseExample: ContractExample = contractExample({
  name: "LegalAmendmentResponse",
  fields: [
    {
      name: "amendment",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => legalAmendmentPublicExample },
    },
  ],
  invariants: [
  ],
});