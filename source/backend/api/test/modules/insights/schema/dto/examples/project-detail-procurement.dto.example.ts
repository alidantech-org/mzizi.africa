import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { projectDetailProcurementBidsExample } from "@test/modules/insights/schema/dto/examples/project-detail-procurement-bids.dto.example.ts";
import { projectDetailProcurementContractsExample } from "@test/modules/insights/schema/dto/examples/project-detail-procurement-contracts.dto.example.ts";

/** The contract shape of ProjectDetailProcurement, for generated tests. */
export const projectDetailProcurementExample: ContractExample = contractExample({
  name: "ProjectDetailProcurement",
  fields: [
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
      array: {},
      spec: {
        kind: "schema",
        example: () => projectDetailProcurementBidsExample,
      },
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
      name: "contracts",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => projectDetailProcurementContractsExample,
      },
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
      name: "title",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
