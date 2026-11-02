import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { verificationPublicExample } from "#/modules/source/dto/verification-public.dto.example.ts";

/** The contract shape of VerificationsListResponse, for generated tests. */
export const verificationsListResponseExample: ContractExample = contractExample({
  name: "VerificationsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "verifications",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => verificationPublicExample },
    },
  ],
  invariants: [
  ],
});