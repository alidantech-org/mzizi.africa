import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { sitePublisherPublicExample } from "#/modules/website/dto/site-publisher-public.dto.example.ts";

/** The contract shape of SitePublishersListResponse, for generated tests. */
export const sitePublishersListResponseExample: ContractExample = contractExample({
  name: "SitePublishersListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "sitePublishers",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => sitePublisherPublicExample },
    },
  ],
  invariants: [
  ],
});