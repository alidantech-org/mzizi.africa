import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { referendumQuestionPublicExample } from "#/modules/elections/dto/referendum-question-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of ReferendumQuestionsListResponse, for generated tests. */
export const referendumQuestionsListResponseExample: ContractExample = contractExample({
  name: "ReferendumQuestionsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "questions",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => referendumQuestionPublicExample },
    },
  ],
  invariants: [
  ],
});