import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of TenderListTenders, for generated tests. */
export const tenderListTendersExample: ContractExample = contractExample({
  name: "TenderListTenders",
  fields: [
    {
      name: "amount",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "awardedOn",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "bids",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "buyer",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "closesOn",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "disclosed",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "disclosedOf",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "place",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "procedure",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "publishedOn",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "reference",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "supplier",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "title",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
