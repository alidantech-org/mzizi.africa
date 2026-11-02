import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { officePublicExample } from "#/modules/governance/dto/office-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of OfficesListResponse, for generated tests. */
export const officesListResponseExample: ContractExample = contractExample({
  name: "OfficesListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "offices",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => officePublicExample },
    },
  ],
  invariants: [
  ],
});