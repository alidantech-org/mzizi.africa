import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { evidenceReferencePublicExample } from "#/modules/audit/dto/evidence-reference-public.dto.example.ts";

/** The contract shape of EvidenceReferenceResponse, for generated tests. */
export const evidenceReferenceResponseExample: ContractExample = contractExample({
  name: "EvidenceReferenceResponse",
  fields: [
    {
      name: "evidence",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => evidenceReferencePublicExample },
    },
  ],
  invariants: [
  ],
});