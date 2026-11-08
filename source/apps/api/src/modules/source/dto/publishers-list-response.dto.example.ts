import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { publisherPublicExample } from "#/modules/source/dto/publisher-public.dto.example.ts";

/** The contract shape of PublishersListResponse, for generated tests. */
export const publishersListResponseExample: ContractExample = contractExample({
  name: "PublishersListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "publishers",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => publisherPublicExample },
    },
  ],
  invariants: [
  ],
});