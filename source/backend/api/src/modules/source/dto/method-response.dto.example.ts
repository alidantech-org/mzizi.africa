import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { methodPublicExample } from "#/modules/source/dto/method-public.dto.example.ts";

/** The contract shape of MethodResponse, for generated tests. */
export const methodResponseExample: ContractExample = contractExample({
  name: "MethodResponse",
  fields: [
    {
      name: "method",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => methodPublicExample },
    },
  ],
  invariants: [
  ],
});