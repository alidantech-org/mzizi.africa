import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { manifestoPublicExample } from "#/modules/elections/dto/manifesto-public.dto.example.ts";

/** The contract shape of ManifestoResponse, for generated tests. */
export const manifestoResponseExample: ContractExample = contractExample({
  name: "ManifestoResponse",
  fields: [
    {
      name: "manifesto",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => manifestoPublicExample },
    },
  ],
  invariants: [
  ],
});