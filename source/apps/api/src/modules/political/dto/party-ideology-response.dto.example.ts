import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { partyIdeologyPublicExample } from "#/modules/political/dto/party-ideology-public.dto.example.ts";

/** The contract shape of PartyIdeologyResponse, for generated tests. */
export const partyIdeologyResponseExample: ContractExample = contractExample({
  name: "PartyIdeologyResponse",
  fields: [
    {
      name: "partyIdeology",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => partyIdeologyPublicExample },
    },
  ],
  invariants: [
  ],
});