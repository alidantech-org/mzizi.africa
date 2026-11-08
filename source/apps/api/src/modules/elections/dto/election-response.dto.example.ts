import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { electionPublicExample } from "#/modules/elections/dto/election-public.dto.example.ts";

/** The contract shape of ElectionResponse, for generated tests. */
export const electionResponseExample: ContractExample = contractExample({
  name: "ElectionResponse",
  fields: [
    {
      name: "election",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => electionPublicExample },
    },
  ],
  invariants: [
  ],
});