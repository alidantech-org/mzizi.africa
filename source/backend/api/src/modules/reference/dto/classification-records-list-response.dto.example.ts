import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { classificationRecordPublicExample } from "#/modules/reference/dto/classification-record-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of ClassificationRecordsListResponse, for generated tests. */
export const classificationRecordsListResponseExample: ContractExample = contractExample({
  name: "ClassificationRecordsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "records",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => classificationRecordPublicExample },
    },
  ],
  invariants: [
  ],
});