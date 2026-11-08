import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { BidStatus } from "#/types/procurement/bid-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { tenderExample } from "#/modules/procurement/dto/tender.dto.example.ts";

/** The contract shape of BidPublic, for generated tests. */
export const bidPublicExample: ContractExample = contractExample({
  name: "BidPublic",
  fields: [
    {
      name: "amount",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "bidderEntityId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "currencyCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 3, maxLength: 3 },
    },
    {
      name: "evaluationNote",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 4000 },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "isCompliant",
      optional: true,
      nullable: true,
      spec: { kind: "boolean" },
    },
    {
      name: "isCurrent",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(BidStatus) },
    },
    {
      name: "submittedOn",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "tenderId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "validFrom",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "validFromPrecision",
      optional: true,
      nullable: true,
      spec: { kind: "enum", values: Object.values(DatePrecision) },
    },
    {
      name: "validTo",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "validToPrecision",
      optional: true,
      nullable: true,
      spec: { kind: "enum", values: Object.values(DatePrecision) },
    },
    {
      name: "version",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
  ],
  invariants: [
  ],
});