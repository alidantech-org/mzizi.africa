import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { manifestoPublicExample } from "#/modules/elections/dto/manifesto-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of ManifestosListResponse, for generated tests. */
export const manifestosListResponseExample: ContractExample = contractExample({
  name: "ManifestosListResponse",
  fields: [
    {
      name: "manifestos",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => manifestoPublicExample },
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