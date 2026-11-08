import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { ProvisionKind } from "#/types/legal/provision-kind.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { legalInstrumentExample } from "#/modules/legal/dto/legal-instrument.dto.example.ts";
import { historicalEntityExample } from "#/modules/shared/dto/historical-entity.dto.example.ts";

/** The contract shape of LegalProvision, for generated tests. */
export const legalProvisionExample: ContractExample = contractExample({
  name: "LegalProvision",
  fields: [
    {
      name: "citation",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 200 },
    },
    {
      name: "content",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1 },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "heading",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "instrumentId",
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
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(ProvisionKind) },
    },
    {
      name: "parentId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "previousVersionId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "sortOrder",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
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