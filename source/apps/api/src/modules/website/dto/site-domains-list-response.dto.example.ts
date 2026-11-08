import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { siteDomainPublicExample } from "#/modules/website/dto/site-domain-public.dto.example.ts";

/** The contract shape of SiteDomainsListResponse, for generated tests. */
export const siteDomainsListResponseExample: ContractExample = contractExample({
  name: "SiteDomainsListResponse",
  fields: [
    {
      name: "domains",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => siteDomainPublicExample },
    },
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
  ],
  invariants: [
  ],
});