import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { entityLocationPublicExample } from "#/modules/entities/dto/entity-location-public.dto.example.ts";

/** The contract shape of EntityLocationResponse, for generated tests. */
export const entityLocationResponseExample: ContractExample = contractExample({
  name: "EntityLocationResponse",
  fields: [
    {
      name: "location",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => entityLocationPublicExample },
    },
  ],
  invariants: [
  ],
});