import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { entityOwnershipPublicExample } from "#/modules/entities/dto/entity-ownership-public.dto.example.ts";

/** The contract shape of EntityOwnershipResponse, for generated tests. */
export const entityOwnershipResponseExample: ContractExample = contractExample({
  name: "EntityOwnershipResponse",
  fields: [
    {
      name: "ownership",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => entityOwnershipPublicExample },
    },
  ],
  invariants: [
  ],
});