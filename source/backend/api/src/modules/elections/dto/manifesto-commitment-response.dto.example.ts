import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { manifestoCommitmentPublicExample } from "#/modules/elections/dto/manifesto-commitment-public.dto.example.ts";

/** The contract shape of ManifestoCommitmentResponse, for generated tests. */
export const manifestoCommitmentResponseExample: ContractExample = contractExample({
  name: "ManifestoCommitmentResponse",
  fields: [
    {
      name: "commitment",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => manifestoCommitmentPublicExample },
    },
  ],
  invariants: [
  ],
});