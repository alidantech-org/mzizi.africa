import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { tenderDetailBidsExample } from "@test/modules/civic/schema/dto/examples/tender-detail-bids.dto.example.ts";
import { tenderDetailNamesExample } from "@test/modules/civic/schema/dto/examples/tender-detail-names.dto.example.ts";

/** The contract shape of TenderDetail, for generated tests. */
export const tenderDetailExample: ContractExample = contractExample({
  name: "TenderDetail",
  fields: [
    {
      name: "amount",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "bidderCount",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "bids",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => tenderDetailBidsExample },
    },
    {
      name: "buyerId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "categoryTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: {
        kind: "string",
        minLength: 1,
        maxLength: 255,
        patterns: [
          "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ],
      },
    },
    {
      name: "currencyCode",
      optional: false,
      nullable: true,
      spec: { kind: "string", exactLength: 3, patterns: ["^[A-Z]{3}$"] },
    },
    {
      name: "names",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => tenderDetailNamesExample },
    },
    {
      name: "procedureTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "procurementId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "projectId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "statusTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [],
});
