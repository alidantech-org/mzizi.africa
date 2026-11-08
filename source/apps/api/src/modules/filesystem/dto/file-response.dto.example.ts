import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { filePublicExample } from "#/modules/filesystem/dto/file-public.dto.example.ts";

/** The contract shape of FileResponse, for generated tests. */
export const fileResponseExample: ContractExample = contractExample({
  name: "FileResponse",
  fields: [
    {
      name: "file",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => filePublicExample },
    },
  ],
  invariants: [
  ],
});