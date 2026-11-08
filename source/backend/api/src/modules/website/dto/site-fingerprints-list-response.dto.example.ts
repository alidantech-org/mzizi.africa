import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { siteFingerprintPublicExample } from "#/modules/website/dto/site-fingerprint-public.dto.example.ts";

/** The contract shape of SiteFingerprintsListResponse, for generated tests. */
export const siteFingerprintsListResponseExample: ContractExample = contractExample({
  name: "SiteFingerprintsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "siteFingerprints",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => siteFingerprintPublicExample },
    },
  ],
  invariants: [
  ],
});