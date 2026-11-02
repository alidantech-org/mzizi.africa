import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { siteTraitPublicExample } from "#/modules/website/dto/site-trait-public.dto.example.ts";

/** The contract shape of SiteTraitsListResponse, for generated tests. */
export const siteTraitsListResponseExample: ContractExample = contractExample({
  name: "SiteTraitsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "siteTraits",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => siteTraitPublicExample },
    },
  ],
  invariants: [
  ],
});