import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { serviceDeliveryPublicExample } from "#/modules/services/dto/service-delivery-public.dto.example.ts";

/** The contract shape of ServiceDeliveryResponse, for generated tests. */
export const serviceDeliveryResponseExample: ContractExample = contractExample({
  name: "ServiceDeliveryResponse",
  fields: [
    {
      name: "delivery",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => serviceDeliveryPublicExample },
    },
  ],
  invariants: [
  ],
});