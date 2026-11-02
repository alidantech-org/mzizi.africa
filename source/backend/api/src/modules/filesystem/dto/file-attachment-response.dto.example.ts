import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { fileAttachmentPublicExample } from "#/modules/filesystem/dto/file-attachment-public.dto.example.ts";

/** The contract shape of FileAttachmentResponse, for generated tests. */
export const fileAttachmentResponseExample: ContractExample = contractExample({
  name: "FileAttachmentResponse",
  fields: [
    {
      name: "attachment",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => fileAttachmentPublicExample },
    },
  ],
  invariants: [
  ],
});