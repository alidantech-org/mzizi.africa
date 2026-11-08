import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { formatPublicExample } from "#/modules/filesystem/dto/format-public.dto.example.ts";

/** The contract shape of FormatResponse, for generated tests. */
export const formatResponseExample: ContractExample = contractExample({
  name: "FormatResponse",
  fields: [
    {
      name: "format",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => formatPublicExample },
    },
  ],
  invariants: [
  ],
});