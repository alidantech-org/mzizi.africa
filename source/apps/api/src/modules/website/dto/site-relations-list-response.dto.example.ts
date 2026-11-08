import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { siteRelationPublicExample } from "#/modules/website/dto/site-relation-public.dto.example.ts";

/** The contract shape of SiteRelationsListResponse, for generated tests. */
export const siteRelationsListResponseExample: ContractExample = contractExample({
  name: "SiteRelationsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "siteRelations",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => siteRelationPublicExample },
    },
  ],
  invariants: [
  ],
});