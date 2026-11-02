import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { personNamePublicExample } from "#/modules/governance/dto/person-name-public.dto.example.ts";

/** The contract shape of PersonNameResponse, for generated tests. */
export const personNameResponseExample: ContractExample = contractExample({
  name: "PersonNameResponse",
  fields: [
    {
      name: "personName",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => personNamePublicExample },
    },
  ],
  invariants: [
  ],
});