import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { partyPositionPublicExample } from "#/modules/political/dto/party-position-public.dto.example.ts";

/** The contract shape of PartyPositionResponse, for generated tests. */
export const partyPositionResponseExample: ContractExample = contractExample({
  name: "PartyPositionResponse",
  fields: [
    {
      name: "position",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => partyPositionPublicExample },
    },
  ],
  invariants: [
  ],
});