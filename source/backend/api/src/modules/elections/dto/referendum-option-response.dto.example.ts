import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { referendumOptionPublicExample } from "#/modules/elections/dto/referendum-option-public.dto.example.ts";

/** The contract shape of ReferendumOptionResponse, for generated tests. */
export const referendumOptionResponseExample: ContractExample = contractExample({
  name: "ReferendumOptionResponse",
  fields: [
    {
      name: "option",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => referendumOptionPublicExample },
    },
  ],
  invariants: [
  ],
});