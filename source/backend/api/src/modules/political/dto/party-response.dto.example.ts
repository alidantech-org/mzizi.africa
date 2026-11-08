import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { partyPublicExample } from "#/modules/political/dto/party-public.dto.example.ts";

/** The contract shape of PartyResponse, for generated tests. */
export const partyResponseExample: ContractExample = contractExample({
  name: "PartyResponse",
  fields: [
    {
      name: "party",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => partyPublicExample },
    },
  ],
  invariants: [
  ],
});