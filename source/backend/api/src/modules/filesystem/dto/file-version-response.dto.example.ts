import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { fileVersionPublicExample } from "#/modules/filesystem/dto/file-version-public.dto.example.ts";

/** The contract shape of FileVersionResponse, for generated tests. */
export const fileVersionResponseExample: ContractExample = contractExample({
  name: "FileVersionResponse",
  fields: [
    {
      name: "version",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => fileVersionPublicExample },
    },
  ],
  invariants: [
  ],
});