import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { structureVersionPublicExample } from "#/modules/website/dto/structure-version-public.dto.example.ts";

/** The contract shape of StructureVersionResponse, for generated tests. */
export const structureVersionResponseExample: ContractExample = contractExample({
  name: "StructureVersionResponse",
  fields: [
    {
      name: "structureVersion",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => structureVersionPublicExample },
    },
  ],
  invariants: [
  ],
});