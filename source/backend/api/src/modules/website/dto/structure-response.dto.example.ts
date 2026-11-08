import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { structurePublicExample } from "#/modules/website/dto/structure-public.dto.example.ts";

/** The contract shape of StructureResponse, for generated tests. */
export const structureResponseExample: ContractExample = contractExample({
  name: "StructureResponse",
  fields: [
    {
      name: "structure",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => structurePublicExample },
    },
  ],
  invariants: [
  ],
});