import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { siteTraitPublicExample } from "#/modules/website/dto/site-trait-public.dto.example.ts";

/** The contract shape of SiteTraitResponse, for generated tests. */
export const siteTraitResponseExample: ContractExample = contractExample({
  name: "SiteTraitResponse",
  fields: [
    {
      name: "siteTrait",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => siteTraitPublicExample },
    },
  ],
  invariants: [
  ],
});