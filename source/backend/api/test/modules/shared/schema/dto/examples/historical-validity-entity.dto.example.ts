import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { validityEntityExample } from "@test/modules/shared/schema/dto/examples/validity-entity.dto.example.ts";

/** The contract shape of HistoricalValidityEntity, for generated tests. */
export const historicalValidityEntityExample: ContractExample = contractExample({
  name: "HistoricalValidityEntity",
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
  ],
});
