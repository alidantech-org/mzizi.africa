import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { referendumOptionPublicExample } from "#/modules/elections/dto/referendum-option-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of ReferendumOptionsListResponse, for generated tests. */
export const referendumOptionsListResponseExample: ContractExample = contractExample({
  name: "ReferendumOptionsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "options",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => referendumOptionPublicExample },
    },
  ],
  invariants: [
  ],
});