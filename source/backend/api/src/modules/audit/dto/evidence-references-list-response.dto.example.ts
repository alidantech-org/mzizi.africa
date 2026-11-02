import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { evidenceReferencePublicExample } from "#/modules/audit/dto/evidence-reference-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of EvidenceReferencesListResponse, for generated tests. */
export const evidenceReferencesListResponseExample: ContractExample = contractExample({
  name: "EvidenceReferencesListResponse",
  fields: [
    {
      name: "evidenceReferences",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => evidenceReferencePublicExample },
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