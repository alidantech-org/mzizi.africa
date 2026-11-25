import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { partyEntryExample } from "@test/modules/politics/schema/dto/examples/party-entry.dto.example.ts";

/** The contract shape of PartyCollection, for generated tests. */
export const partyCollectionExample: ContractExample = contractExample({
  name: "PartyCollection",
  fields: [
    {
      name: "parties",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => partyEntryExample },
    },
  ],
  invariants: [],
});
