import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { structureFilePublicExample } from "#/modules/website/dto/structure-file-public.dto.example.ts";

/** The contract shape of StructureFileResponse, for generated tests. */
export const structureFileResponseExample: ContractExample = contractExample({
  name: "StructureFileResponse",
  fields: [
    {
      name: "structureFile",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => structureFilePublicExample },
    },
  ],
  invariants: [
  ],
});