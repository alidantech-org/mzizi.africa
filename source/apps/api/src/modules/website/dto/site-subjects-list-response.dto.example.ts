import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { siteSubjectPublicExample } from "#/modules/website/dto/site-subject-public.dto.example.ts";

/** The contract shape of SiteSubjectsListResponse, for generated tests. */
export const siteSubjectsListResponseExample: ContractExample = contractExample({
  name: "SiteSubjectsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "siteSubjects",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => siteSubjectPublicExample },
    },
  ],
  invariants: [
  ],
});