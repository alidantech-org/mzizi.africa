import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { capturePublicExample } from "#/modules/source/dto/capture-public.dto.example.ts";

/** The contract shape of CapturesListResponse, for generated tests. */
export const capturesListResponseExample: ContractExample = contractExample({
  name: "CapturesListResponse",
  fields: [
    {
      name: "captures",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => capturePublicExample },
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