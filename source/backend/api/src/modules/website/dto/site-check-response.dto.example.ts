import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { siteCheckPublicExample } from "#/modules/website/dto/site-check-public.dto.example.ts";

/** The contract shape of SiteCheckResponse, for generated tests. */
export const siteCheckResponseExample: ContractExample = contractExample({
  name: "SiteCheckResponse",
  fields: [
    {
      name: "siteCheck",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => siteCheckPublicExample },
    },
  ],
  invariants: [
  ],
});