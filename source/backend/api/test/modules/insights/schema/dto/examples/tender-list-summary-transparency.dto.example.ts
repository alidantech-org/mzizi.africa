import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of TenderListSummaryTransparency, for generated tests. */
export const tenderListSummaryTransparencyExample: ContractExample = contractExample({
  name: "TenderListSummaryTransparency",
  fields: [
    {
      name: "listed",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "withContract",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
