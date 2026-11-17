import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of FeatureGeometry, for generated tests. */
export const featureGeometryExample: ContractExample = contractExample({
  name: "FeatureGeometry",
  fields: [
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
      name: "geometryRoleId",
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
      name: "validFrom",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
  ],
  invariants: [],
});
