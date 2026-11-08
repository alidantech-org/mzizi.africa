import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { ideologyPublicExample } from "#/modules/political/dto/ideology-public.dto.example.ts";

/** The contract shape of IdeologyResponse, for generated tests. */
export const ideologyResponseExample: ContractExample = contractExample({
  name: "IdeologyResponse",
  fields: [
    {
      name: "ideology",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => ideologyPublicExample },
    },
  ],
  invariants: [
  ],
});