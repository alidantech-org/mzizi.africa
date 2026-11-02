import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { personContactPublicExample } from "#/modules/person/dto/person-contact-public.dto.example.ts";

/** The contract shape of PersonContactResponse, for generated tests. */
export const personContactResponseExample: ContractExample = contractExample({
  name: "PersonContactResponse",
  fields: [
    {
      name: "contact",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => personContactPublicExample },
    },
  ],
  invariants: [
  ],
});