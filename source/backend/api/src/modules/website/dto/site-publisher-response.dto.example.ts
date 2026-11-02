import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { sitePublisherPublicExample } from "#/modules/website/dto/site-publisher-public.dto.example.ts";

/** The contract shape of SitePublisherResponse, for generated tests. */
export const sitePublisherResponseExample: ContractExample = contractExample({
  name: "SitePublisherResponse",
  fields: [
    {
      name: "sitePublisher",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => sitePublisherPublicExample },
    },
  ],
  invariants: [
  ],
});