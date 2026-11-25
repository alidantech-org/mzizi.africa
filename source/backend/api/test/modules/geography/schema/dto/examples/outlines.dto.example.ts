import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { featuresExample } from "@test/modules/geography/schema/dto/examples/features.dto.example.ts";
import { geometriesExample } from "@test/modules/geography/schema/dto/examples/geometries.dto.example.ts";
import { associationExample } from "@test/modules/shared/schema/dto/examples/association.dto.example.ts";

/** The contract shape of Outlines, for generated tests. */
export const outlinesExample: ContractExample = contractExample({
  name: "Outlines",
  fields: [
    {
      name: "band",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0, max: 3 },
    },
    {
      name: "bbox",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
    {
      name: "builtAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "centroid",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
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
      name: "featureId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "geometry",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
    {
      name: "geometryId",
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
      name: "points",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "tolerance",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
