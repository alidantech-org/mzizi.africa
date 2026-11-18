import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of TenderList, for generated tests. */
export const tenderListExample: ContractExample = contractExample({
  name: "TenderList",
  fields: [
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "summary",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
    {
      name: "tenders",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
  ],
  invariants: [],
});
