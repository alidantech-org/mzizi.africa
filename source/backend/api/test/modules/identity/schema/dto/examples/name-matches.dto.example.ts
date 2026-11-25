import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { nameMatchExample } from "@test/modules/identity/schema/dto/examples/name-match.dto.example.ts";

/** The contract shape of NameMatches, for generated tests. */
export const nameMatchesExample: ContractExample = contractExample({
  name: "NameMatches",
  fields: [
    {
      name: "matches",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => nameMatchExample },
    },
  ],
  invariants: [],
});
