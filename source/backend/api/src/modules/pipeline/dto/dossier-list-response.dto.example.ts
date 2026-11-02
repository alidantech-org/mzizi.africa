import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { dossierSummaryExample } from "#/modules/pipeline/dto/dossier-summary.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of DossierListResponse, for generated tests. */
export const dossierListResponseExample: ContractExample = contractExample({
  name: "DossierListResponse",
  fields: [
    {
      name: "dossiers",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => dossierSummaryExample },
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