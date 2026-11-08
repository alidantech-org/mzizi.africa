import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { publicServicePublicExample } from "#/modules/services/dto/public-service-public.dto.example.ts";

/** The contract shape of PublicServiceResponse, for generated tests. */
export const publicServiceResponseExample: ContractExample = contractExample({
  name: "PublicServiceResponse",
  fields: [
    {
      name: "service",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => publicServicePublicExample },
    },
  ],
  invariants: [
  ],
});