import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of TenderDetailBids, for generated tests. */
export const tenderDetailBidsExample: ContractExample = contractExample({
  name: "TenderDetailBids",
  fields: [
    {
      name: "amount",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "bidderId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "outcomeTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "submittedOn",
      optional: false,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
  ],
  invariants: [],
});
