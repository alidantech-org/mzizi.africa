import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ProjectDetailProcurementContracts, for generated tests. */
export const projectDetailProcurementContractsExample: ContractExample = contractExample({
  name: "ProjectDetailProcurementContracts",
  fields: [
    {
      name: "amount",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "contractor",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "signedOn",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
