import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { officeRulePublicExample } from "#/modules/governance/dto/office-rule-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of OfficeRulesListResponse, for generated tests. */
export const officeRulesListResponseExample: ContractExample = contractExample({
  name: "OfficeRulesListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "rules",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => officeRulePublicExample },
    },
  ],
  invariants: [
  ],
});