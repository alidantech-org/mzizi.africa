import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { domainPatternPublicExample } from "#/modules/website/dto/domain-pattern-public.dto.example.ts";

/** The contract shape of DomainPatternsListResponse, for generated tests. */
export const domainPatternsListResponseExample: ContractExample = contractExample({
  name: "DomainPatternsListResponse",
  fields: [
    {
      name: "domainPatterns",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => domainPatternPublicExample },
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