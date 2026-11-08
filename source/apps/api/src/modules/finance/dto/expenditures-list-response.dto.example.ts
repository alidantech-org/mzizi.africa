import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { expenditurePublicExample } from "#/modules/finance/dto/expenditure-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of ExpendituresListResponse, for generated tests. */
export const expendituresListResponseExample: ContractExample = contractExample({
  name: "ExpendituresListResponse",
  fields: [
    {
      name: "expenditures",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => expenditurePublicExample },
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