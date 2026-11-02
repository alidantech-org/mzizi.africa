import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { LedgerReferenceKind } from "#/types/finance/ledger-reference-kind.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { budgetaryUnitExample } from "#/modules/finance/dto/budgetary-unit.dto.example.ts";

/** The contract shape of LedgerEntryPublic, for generated tests. */
export const ledgerEntryPublicExample: ContractExample = contractExample({
  name: "LedgerEntryPublic",
  fields: [
    {
      name: "accountCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "creditAmount",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "currencyCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 3, maxLength: 3 },
    },
    {
      name: "debitAmount",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
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
      name: "postedOn",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "referenceId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "referenceKind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(LedgerReferenceKind) },
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