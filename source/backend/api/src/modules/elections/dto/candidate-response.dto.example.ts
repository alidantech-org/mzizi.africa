import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { candidatePublicExample } from "#/modules/elections/dto/candidate-public.dto.example.ts";

/** The contract shape of CandidateResponse, for generated tests. */
export const candidateResponseExample: ContractExample = contractExample({
  name: "CandidateResponse",
  fields: [
    {
      name: "candidate",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => candidatePublicExample },
    },
  ],
  invariants: [
  ],
});