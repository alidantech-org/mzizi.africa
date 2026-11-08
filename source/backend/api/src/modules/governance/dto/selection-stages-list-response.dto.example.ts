import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { selectionStagePublicExample } from "#/modules/governance/dto/selection-stage-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of SelectionStagesListResponse, for generated tests. */
export const selectionStagesListResponseExample: ContractExample = contractExample({
  name: "SelectionStagesListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "stages",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => selectionStagePublicExample },
    },
  ],
  invariants: [
  ],
});