import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { folderPublicExample } from "#/modules/filesystem/dto/folder-public.dto.example.ts";

/** The contract shape of FolderResponse, for generated tests. */
export const folderResponseExample: ContractExample = contractExample({
  name: "FolderResponse",
  fields: [
    {
      name: "folder",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => folderPublicExample },
    },
  ],
  invariants: [
  ],
});