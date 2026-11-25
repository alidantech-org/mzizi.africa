import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { associationExample } from "@test/modules/shared/schema/dto/examples/association.dto.example.ts";
import { indicatorsExample } from "@test/modules/statistics/schema/dto/examples/indicators.dto.example.ts";
import { termsExample } from "@test/modules/vocabulary/schema/dto/examples/terms.dto.example.ts";

/** The contract shape of Components, for generated tests. */
export const componentsExample: ContractExample = contractExample({
  name: "Components",
  fields: [
    {
      name: "componentId",
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
      name: "indicatorId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "position",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "transformTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "weight",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [
    {
      any: false,
      comparisons: [
        {
          left: { field: "indicatorId" },
          operator: "not-equal",
          right: { field: "componentId" },
        },
      ],
    },
    {
      any: false,
      comparisons: [
        {
          left: { field: "weight" },
          operator: "greater-than",
          right: { literal: 0 },
        },
      ],
    },
  ],
});
