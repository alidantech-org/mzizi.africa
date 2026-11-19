import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { fundExample } from "@test/modules/ledger/schema/dto/examples/fund.dto.example.ts";

/** The contract shape of FundList, for generated tests. */
export const fundListExample: ContractExample = contractExample({
  name: "FundList",
  fields: [
    {
      name: "funds",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => fundExample },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "total",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0, max: 100000000 },
    },
  ],
  invariants: [],
});
