import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { jurisdictionPublicExample } from "#/modules/reference/dto/jurisdiction-public.dto.example.ts";

/** The contract shape of JurisdictionResponse, for generated tests. */
export const jurisdictionResponseExample: ContractExample = contractExample({
  name: "JurisdictionResponse",
  fields: [
    {
      name: "jurisdiction",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => jurisdictionPublicExample },
    },
  ],
  invariants: [
  ],
});