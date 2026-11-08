import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { ConfidenceLevel } from "#/types/statistics/confidence-level.enum.ts";
import { EstimateKind } from "#/types/statistics/estimate-kind.enum.ts";
import { MeasureType } from "#/types/statistics/measure-type.enum.ts";
import { statisticsTableExample } from "#/modules/statistics/dto/statistics-table.dto.example.ts";

/** The contract shape of ObservationPublic, for generated tests. */
export const observationPublicExample: ContractExample = contractExample({
  name: "ObservationPublic",
  fields: [
    {
      name: "columnId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "confidenceLevel",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(ConfidenceLevel) },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "denominatorObservationId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "denominatorValue",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "estimateKind",
      optional: true,
      nullable: true,
      spec: { kind: "enum", values: Object.values(EstimateKind) },
    },
    {
      name: "geoUnitId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "indicatorId",
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
      name: "marginOfError",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "measureType",
      optional: true,
      nullable: true,
      spec: { kind: "enum", values: Object.values(MeasureType) },
    },
    {
      name: "numericValue",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "periodId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "releaseLabel",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 200 },
    },
    {
      name: "standardError",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "tableId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "textValue",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 4000 },
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
    {
      name: "vintageId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [
  ],
});