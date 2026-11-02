import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { legalAuthorityLinkPublicExample } from "#/modules/legal/dto/legal-authority-link-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of LegalAuthorityLinksListResponse, for generated tests. */
export const legalAuthorityLinksListResponseExample: ContractExample = contractExample({
  name: "LegalAuthorityLinksListResponse",
  fields: [
    {
      name: "links",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => legalAuthorityLinkPublicExample },
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