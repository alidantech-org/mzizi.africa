import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { legalInstrumentPublicExample } from "#/modules/legal/dto/legal-instrument-public.dto.example.ts";

/** The contract shape of LegalInstrumentResponse, for generated tests. */
export const legalInstrumentResponseExample: ContractExample = contractExample({
  name: "LegalInstrumentResponse",
  fields: [
    {
      name: "instrument",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => legalInstrumentPublicExample },
    },
  ],
  invariants: [
  ],
});