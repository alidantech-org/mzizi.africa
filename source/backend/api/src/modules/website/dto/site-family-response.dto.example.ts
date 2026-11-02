import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { siteFamilyPublicExample } from "#/modules/website/dto/site-family-public.dto.example.ts";

/** The contract shape of SiteFamilyResponse, for generated tests. */
export const siteFamilyResponseExample: ContractExample = contractExample({
  name: "SiteFamilyResponse",
  fields: [
    {
      name: "family",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => siteFamilyPublicExample },
    },
  ],
  invariants: [
  ],
});