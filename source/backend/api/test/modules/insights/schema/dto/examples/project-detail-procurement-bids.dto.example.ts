import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ProjectDetailProcurementBids, for generated tests. */
export const projectDetailProcurementBidsExample: ContractExample = contractExample({
  name: "ProjectDetailProcurementBids",
  fields: [
    {
      name: "amount",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "bidder",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "outcome",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
