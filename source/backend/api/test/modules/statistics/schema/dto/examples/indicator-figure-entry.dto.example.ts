import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { FigureBasis } from "#/modules/shared/schema/enum/figure-basis.enum.ts";
import { FigureStatus } from "#/modules/shared/schema/enum/figure-status.enum.ts";

/** The contract shape of IndicatorFigureEntry, for generated tests. */
export const indicatorFigureEntryExample: ContractExample = contractExample({
  name: "IndicatorFigureEntry",
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
      name: "endsOn",
      optional: false,
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
      name: "figureId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "fromYear",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: -10000, max: 3000 },
    },
    {
      name: "indicatorCode",
      optional: false,
      nullable: true,
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
      name: "indicatorId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "lower",
      optional: false,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "metricId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "observationId",
      optional: false,
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
      optional: false,
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
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "toYear",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: -10000, max: 3000 },
    },
    {
      name: "upper",
      optional: false,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "value",
      optional: false,
      nullable: true,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
