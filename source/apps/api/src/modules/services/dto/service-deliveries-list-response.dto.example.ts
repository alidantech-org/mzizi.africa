import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { serviceDeliveryPublicExample } from "#/modules/services/dto/service-delivery-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of ServiceDeliveriesListResponse, for generated tests. */
export const serviceDeliveriesListResponseExample: ContractExample = contractExample({
  name: "ServiceDeliveriesListResponse",
  fields: [
    {
      name: "deliveries",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => serviceDeliveryPublicExample },
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