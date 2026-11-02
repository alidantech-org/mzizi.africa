import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { periodPublicExample } from "#/modules/statistics/dto/period-public.dto.example.ts";

/** The contract shape of PeriodsListResponse, for generated tests. */
export const periodsListResponseExample: ContractExample = contractExample({
  name: "PeriodsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "periods",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => periodPublicExample },
    },
  ],
  invariants: [
  ],
});