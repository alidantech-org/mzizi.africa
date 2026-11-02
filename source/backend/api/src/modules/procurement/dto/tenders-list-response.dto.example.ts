import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { tenderPublicExample } from "#/modules/procurement/dto/tender-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of TendersListResponse, for generated tests. */
export const tendersListResponseExample: ContractExample = contractExample({
  name: "TendersListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "tenders",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => tenderPublicExample },
    },
  ],
  invariants: [
  ],
});