import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { personPublicExample } from "#/modules/person/dto/person-public.dto.example.ts";

/** The contract shape of PersonResponse, for generated tests. */
export const personResponseExample: ContractExample = contractExample({
  name: "PersonResponse",
  fields: [
    {
      name: "person",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => personPublicExample },
    },
  ],
  invariants: [
  ],
});