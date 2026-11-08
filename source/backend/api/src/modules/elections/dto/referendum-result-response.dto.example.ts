import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { referendumResultPublicExample } from "#/modules/elections/dto/referendum-result-public.dto.example.ts";

/** The contract shape of ReferendumResultResponse, for generated tests. */
export const referendumResultResponseExample: ContractExample = contractExample({
  name: "ReferendumResultResponse",
  fields: [
    {
      name: "referendumResult",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => referendumResultPublicExample },
    },
  ],
  invariants: [
  ],
});