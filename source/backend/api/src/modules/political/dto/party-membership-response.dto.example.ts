import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { partyMembershipPublicExample } from "#/modules/political/dto/party-membership-public.dto.example.ts";

/** The contract shape of PartyMembershipResponse, for generated tests. */
export const partyMembershipResponseExample: ContractExample = contractExample({
  name: "PartyMembershipResponse",
  fields: [
    {
      name: "membership",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => partyMembershipPublicExample },
    },
  ],
  invariants: [
  ],
});