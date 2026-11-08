import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { ElectionStatus } from "#/types/elections/election-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { historicalEntityExample } from "#/modules/shared/dto/historical-entity.dto.example.ts";

/** The contract shape of Election, for generated tests. */
export const electionExample: ContractExample = contractExample({
  name: "Election",
  fields: [
    {
      name: "administeringInstitutionId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 200 },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "geoUnitId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "heldDate",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
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
      name: "jurisdictionId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "legalBasisId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "scheduledDate",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(ElectionStatus) },
    },
    {
      name: "typeId",
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