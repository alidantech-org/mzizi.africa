import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { localityUnitExample } from "@test/modules/locality/schema/dto/examples/locality-unit.dto.example.ts";

/** The contract shape of LocalityMatches, for generated tests. */
export const localityMatchesExample: ContractExample = contractExample({
  name: "LocalityMatches",
  fields: [
    {
      name: "places",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => localityUnitExample },
    },
  ],
  invariants: [],
});
