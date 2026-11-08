import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { personHandlePublicExample } from "#/modules/person/dto/person-handle-public.dto.example.ts";

/** The contract shape of PersonHandleResponse, for generated tests. */
export const personHandleResponseExample: ContractExample = contractExample({
  name: "PersonHandleResponse",
  fields: [
    {
      name: "handle",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => personHandlePublicExample },
    },
  ],
  invariants: [
  ],
});