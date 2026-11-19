import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { coalitionExample } from "@test/modules/ledger/schema/dto/examples/coalition.dto.example.ts";

/** The contract shape of CoalitionList, for generated tests. */
export const coalitionListExample: ContractExample = contractExample({
  name: "CoalitionList",
  fields: [
    {
      name: "coalitions",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => coalitionExample },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
  ],
  invariants: [],
});
