import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { FigureBasis } from "#/modules/shared/schema/enum/figure-basis.enum.ts";
import { FigureStatus } from "#/modules/shared/schema/enum/figure-status.enum.ts";
import { featuresExample } from "@test/modules/geography/schema/dto/examples/features.dto.example.ts";
import { identitiesExample } from "@test/modules/identity/schema/dto/examples/identities.dto.example.ts";
import { countriesExample } from "@test/modules/reference/schema/dto/examples/countries.dto.example.ts";
import { partitionedRecordExample } from "@test/modules/shared/schema/dto/examples/partitioned-record.dto.example.ts";
import { indicatorsExample } from "@test/modules/statistics/schema/dto/examples/indicators.dto.example.ts";
import { metricsExample } from "@test/modules/statistics/schema/dto/examples/metrics.dto.example.ts";
import { observationsExample } from "@test/modules/statistics/schema/dto/examples/observations.dto.example.ts";

/** The contract shape of Figures, for generated tests. */
export const figuresExample: ContractExample = contractExample({
  name: "Figures",
  fields: [
    {
      name: "basis",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(FigureBasis) },
    },
    {
      name: "cell",
      optional: false,
      nullable: false,
      spec: { kind: "string", maxLength: 1000 },
    },
    {
      name: "countryId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "endsOn",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "featureId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "fromYear",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: -10000, max: 3000 },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "indicatorId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "lower",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "metricId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "observationId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "refreshedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "startsOn",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(FigureStatus) },
    },
    {
      name: "subjectId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "toYear",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: -10000, max: 3000 },
    },
    {
      name: "upper",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "value",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
