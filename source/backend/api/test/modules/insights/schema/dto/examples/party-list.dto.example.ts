import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { partyListPartiesExample } from "@test/modules/insights/schema/dto/examples/party-list-parties.dto.example.ts";

/** The contract shape of PartyList, for generated tests. */
export const partyListExample: ContractExample = contractExample({
  name: "PartyList",
  fields: [
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "parties",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => partyListPartiesExample },
    },
  ],
  invariants: [],
});
