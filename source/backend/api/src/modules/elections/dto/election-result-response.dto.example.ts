import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { electionResultPublicExample } from "#/modules/elections/dto/election-result-public.dto.example.ts";

/** The contract shape of ElectionResultResponse, for generated tests. */
export const electionResultResponseExample: ContractExample = contractExample({
  name: "ElectionResultResponse",
  fields: [
    {
      name: "result",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => electionResultPublicExample },
    },
  ],
  invariants: [
  ],
});