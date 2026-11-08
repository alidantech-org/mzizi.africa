import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { formatPublicExample } from "#/modules/filesystem/dto/format-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of FormatsListResponse, for generated tests. */
export const formatsListResponseExample: ContractExample = contractExample({
  name: "FormatsListResponse",
  fields: [
    {
      name: "formats",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => formatPublicExample },
    },
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
  ],
  invariants: [
  ],
});