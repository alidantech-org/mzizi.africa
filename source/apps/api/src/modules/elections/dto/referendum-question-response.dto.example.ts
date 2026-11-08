import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { referendumQuestionPublicExample } from "#/modules/elections/dto/referendum-question-public.dto.example.ts";

/** The contract shape of ReferendumQuestionResponse, for generated tests. */
export const referendumQuestionResponseExample: ContractExample = contractExample({
  name: "ReferendumQuestionResponse",
  fields: [
    {
      name: "question",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => referendumQuestionPublicExample },
    },
  ],
  invariants: [
  ],
});