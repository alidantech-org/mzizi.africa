import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { documentPublicExample } from "#/modules/source/dto/document-public.dto.example.ts";

/** The contract shape of DocumentResponse, for generated tests. */
export const documentResponseExample: ContractExample = contractExample({
  name: "DocumentResponse",
  fields: [
    {
      name: "document",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => documentPublicExample },
    },
  ],
  invariants: [
  ],
});