import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { procurementContractPublicExample } from "#/modules/procurement/dto/procurement-contract-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of ProcurementContractsListResponse, for generated tests. */
export const procurementContractsListResponseExample: ContractExample = contractExample({
  name: "ProcurementContractsListResponse",
  fields: [
    {
      name: "contracts",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => procurementContractPublicExample },
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