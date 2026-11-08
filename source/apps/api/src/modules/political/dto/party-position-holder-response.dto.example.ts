import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { partyPositionHolderPublicExample } from "#/modules/political/dto/party-position-holder-public.dto.example.ts";

/** The contract shape of PartyPositionHolderResponse, for generated tests. */
export const partyPositionHolderResponseExample: ContractExample = contractExample({
  name: "PartyPositionHolderResponse",
  fields: [
    {
      name: "holder",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => partyPositionHolderPublicExample },
    },
  ],
  invariants: [
  ],
});