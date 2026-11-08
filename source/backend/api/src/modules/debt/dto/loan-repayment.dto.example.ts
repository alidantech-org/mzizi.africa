import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { loanExample } from "#/modules/debt/dto/loan.dto.example.ts";
import { historicalEntityExample } from "#/modules/shared/dto/historical-entity.dto.example.ts";

/** The contract shape of LoanRepayment, for generated tests. */
export const loanRepaymentExample: ContractExample = contractExample({
  name: "LoanRepayment",
  fields: [
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
      name: "feesPaid",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "interestPaid",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "isCurrent",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "ledgerEntryId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "loanId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "paidOn",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "principalPaid",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
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