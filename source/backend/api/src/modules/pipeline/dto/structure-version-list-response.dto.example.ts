import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { structureVersionSummaryExample } from "#/modules/pipeline/dto/structure-version-summary.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of StructureVersionListResponse, for generated tests. */
export const structureVersionListResponseExample: ContractExample = contractExample({
  name: "StructureVersionListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "structureVersions",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => structureVersionSummaryExample },
    },
  ],
  invariants: [
  ],
});