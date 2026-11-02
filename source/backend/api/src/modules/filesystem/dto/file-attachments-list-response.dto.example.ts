import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { fileAttachmentPublicExample } from "#/modules/filesystem/dto/file-attachment-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of FileAttachmentsListResponse, for generated tests. */
export const fileAttachmentsListResponseExample: ContractExample = contractExample({
  name: "FileAttachmentsListResponse",
  fields: [
    {
      name: "attachments",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => fileAttachmentPublicExample },
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