import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { publicServicePublicExample } from "#/modules/services/dto/public-service-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of PublicServicesListResponse, for generated tests. */
export const publicServicesListResponseExample: ContractExample = contractExample({
  name: "PublicServicesListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "services",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => publicServicePublicExample },
    },
  ],
  invariants: [
  ],
});