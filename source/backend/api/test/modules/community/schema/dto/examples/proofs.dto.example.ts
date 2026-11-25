import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { LocationCheck } from "#/modules/community/schema/enum/location-check.enum.ts";
import { actorsExample } from "@test/modules/community/schema/dto/examples/actors.dto.example.ts";
import { devicesExample } from "@test/modules/community/schema/dto/examples/devices.dto.example.ts";
import { featuresExample } from "@test/modules/geography/schema/dto/examples/features.dto.example.ts";
import { entityExample } from "@test/modules/shared/schema/dto/examples/entity.dto.example.ts";

/** The contract shape of Proofs, for generated tests. */
export const proofsExample: ContractExample = contractExample({
  name: "Proofs",
  fields: [
    {
      name: "accuracyMeters",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "actorId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "attestationOk",
      optional: true,
      nullable: true,
      spec: { kind: "boolean" },
    },
    {
      name: "check",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(LocationCheck) },
    },
    {
      name: "coarseCell",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
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
      name: "deviceId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "headerAgrees",
      optional: true,
      nullable: true,
      spec: { kind: "boolean" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "matchedFeatureId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "mockLocationDetected",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "recordedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "travelOk",
      optional: true,
      nullable: true,
      spec: { kind: "boolean" },
    },
    {
      name: "trustScore",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: 0, max: 100 },
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
  invariants: [],
});
