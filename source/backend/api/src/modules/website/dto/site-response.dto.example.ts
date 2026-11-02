import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { sitePublicExample } from "#/modules/website/dto/site-public.dto.example.ts";

/** The contract shape of SiteResponse, for generated tests. */
export const siteResponseExample: ContractExample = contractExample({
  name: "SiteResponse",
  fields: [
    {
      name: "site",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => sitePublicExample },
    },
  ],
  invariants: [
  ],
});