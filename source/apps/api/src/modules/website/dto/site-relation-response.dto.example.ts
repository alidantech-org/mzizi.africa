import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { siteRelationPublicExample } from "#/modules/website/dto/site-relation-public.dto.example.ts";

/** The contract shape of SiteRelationResponse, for generated tests. */
export const siteRelationResponseExample: ContractExample = contractExample({
  name: "SiteRelationResponse",
  fields: [
    {
      name: "siteRelation",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => siteRelationPublicExample },
    },
  ],
  invariants: [
  ],
});