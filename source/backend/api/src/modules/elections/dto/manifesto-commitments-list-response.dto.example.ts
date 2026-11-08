import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { manifestoCommitmentPublicExample } from "#/modules/elections/dto/manifesto-commitment-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of ManifestoCommitmentsListResponse, for generated tests. */
export const manifestoCommitmentsListResponseExample: ContractExample = contractExample({
  name: "ManifestoCommitmentsListResponse",
  fields: [
    {
      name: "commitments",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => manifestoCommitmentPublicExample },
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