import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { documentSummaryExample } from "#/modules/pipeline/dto/document-summary.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of DocumentListResponse, for generated tests. */
export const documentListResponseExample: ContractExample = contractExample({
  name: "DocumentListResponse",
  fields: [
    {
      name: "documents",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => documentSummaryExample },
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