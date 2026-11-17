import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import { featuresExample } from "@test/modules/geography/schema/dto/examples/features.dto.example.ts";
import { valueExample } from "@test/modules/reference/schema/dto/examples/value.dto.example.ts";
import { periodEntityExample } from "@test/modules/shared/schema/dto/examples/period-entity.dto.example.ts";

/** The contract shape of Geometries, for generated tests. */
export const geometriesExample: ContractExample = contractExample({
  name: "Geometries",
  fields: [
    {
      name: "area",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "basisId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "centroid",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
    {
      name: "confidence",
      optional: true,
      nullable: true,
      spec: { kind: "number", min: 0, max: 1 },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "deletedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "envelope",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
    {
      name: "featureId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "fromToPrecision",
      optional: true,
      nullable: true,
      spec: { kind: "enum", values: Object.values(DatePrecision) },
    },
    {
      name: "fromYear",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: -10000, max: 3000 },
    },
    {
      name: "geometry",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
    {
      name: "geometryRoleId",
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
      name: "maxZoom",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "minZoom",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "observedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "revision",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1 },
    },
    {
      name: "srid",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1 },
    },
    {
      name: "supersedesId",
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
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "version",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1 },
    },
  ],
  invariants: [
    {
      any: true,
      comparisons: [
        {
          left: { field: "fromYear" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "toYear" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "fromYear" },
          operator: "less-than-or-equal",
          right: { field: "toYear" },
        },
      ],
    },
    {
      any: true,
      comparisons: [
        {
          left: { field: "minZoom" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "maxZoom" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "minZoom" },
          operator: "less-than",
          right: { field: "maxZoom" },
        },
      ],
    },
    {
      any: false,
      comparisons: [
        {
          left: { field: "id" },
          operator: "not-equal",
          right: { field: "supersedesId" },
        },
      ],
    },
  ],
});
