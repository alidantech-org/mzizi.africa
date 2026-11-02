import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { partyUnitPublicExample } from "#/modules/political/dto/party-unit-public.dto.example.ts";

/** The contract shape of PartyUnitResponse, for generated tests. */
export const partyUnitResponseExample: ContractExample = contractExample({
  name: "PartyUnitResponse",
  fields: [
    {
      name: "unit",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => partyUnitPublicExample },
    },
  ],
  invariants: [
  ],
});