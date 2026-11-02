import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { officeHolderPublicExample } from "#/modules/governance/dto/office-holder-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of OfficeHoldersListResponse, for generated tests. */
export const officeHoldersListResponseExample: ContractExample = contractExample({
  name: "OfficeHoldersListResponse",
  fields: [
    {
      name: "holders",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => officeHolderPublicExample },
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