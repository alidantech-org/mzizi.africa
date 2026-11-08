import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { entityIdentifierPublicExample } from "#/modules/entities/dto/entity-identifier-public.dto.example.ts";

/** The contract shape of EntityIdentifierResponse, for generated tests. */
export const entityIdentifierResponseExample: ContractExample = contractExample({
  name: "EntityIdentifierResponse",
  fields: [
    {
      name: "identifier",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => entityIdentifierPublicExample },
    },
  ],
  invariants: [
  ],
});