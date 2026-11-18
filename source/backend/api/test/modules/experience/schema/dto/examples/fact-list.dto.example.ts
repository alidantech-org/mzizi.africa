import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { factRowExample } from "@test/modules/experience/schema/dto/examples/fact-row.dto.example.ts";

/** The contract shape of FactList, for generated tests. */
export const factListExample: ContractExample = contractExample({
  name: "FactList",
  fields: [
    {
      name: "facts",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => factRowExample },
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
