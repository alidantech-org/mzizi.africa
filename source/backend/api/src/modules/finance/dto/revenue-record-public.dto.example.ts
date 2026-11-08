import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { FundRestriction } from "#/types/finance/fund-restriction.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { budgetaryUnitExample } from "#/modules/finance/dto/budgetary-unit.dto.example.ts";

/** The contract shape of RevenueRecordPublic, for generated tests. */
export const revenueRecordPublicExample: ContractExample = contractExample({
  name: "RevenueRecordPublic",
  fields: [
    {
      name: "amount",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "categoryId",
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
      name: "fiscalYearId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "isCurrent",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "payerEntityId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "receivedOn",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "restriction",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(FundRestriction) },
    },
    {
      name: "unitId",
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