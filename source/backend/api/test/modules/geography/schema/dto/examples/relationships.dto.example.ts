import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { featuresExample } from "@test/modules/geography/schema/dto/examples/features.dto.example.ts";
import { valueExample } from "@test/modules/reference/schema/dto/examples/value.dto.example.ts";
import { historicalValidityEntityExample } from "@test/modules/shared/schema/dto/examples/historical-validity-entity.dto.example.ts";

/** The contract shape of Relationships, for generated tests. */
export const relationshipsExample: ContractExample = contractExample({
  name: "Relationships",
  fields: [
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
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "objectFeatureId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "relationshipKindId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "sourceRefId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "subjectFeatureId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "systemId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "validFrom",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "validFromEarliest",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "validFromLatest",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "validUntil",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "validUntilEarliest",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "validUntilLatest",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
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
          left: { field: "validFrom" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "validUntil" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "validFrom" },
          operator: "less-than",
          right: { field: "validUntil" },
        },
      ],
    },
    {
      any: true,
      comparisons: [
        {
          left: { field: "validFromEarliest" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "validFromLatest" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "validFromEarliest" },
          operator: "less-than",
          right: { field: "validFromLatest" },
        },
      ],
    },
    {
      any: true,
      comparisons: [
        {
          left: { field: "validUntilEarliest" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "validUntilLatest" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "validUntilEarliest" },
          operator: "less-than",
          right: { field: "validUntilLatest" },
        },
      ],
    },
    {
      any: false,
      comparisons: [
        {
          left: { field: "subjectFeatureId" },
          operator: "not-equal",
          right: { field: "objectFeatureId" },
        },
      ],
    },
  ],
});
