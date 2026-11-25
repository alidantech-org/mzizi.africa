import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { IdentityKind } from "#/modules/shared/schema/enum/identity-kind.enum.ts";
import { identitiesExample } from "@test/modules/identity/schema/dto/examples/identities.dto.example.ts";
import { unitsExample } from "@test/modules/reference/schema/dto/examples/units.dto.example.ts";
import { identityEntityExample } from "@test/modules/shared/schema/dto/examples/identity-entity.dto.example.ts";
import { indicatorsExample } from "@test/modules/statistics/schema/dto/examples/indicators.dto.example.ts";
import { termsExample } from "@test/modules/vocabulary/schema/dto/examples/terms.dto.example.ts";

/** The contract shape of Metrics, for generated tests. */
export const metricsExample: ContractExample = contractExample({
  name: "Metrics",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
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
      name: "denominatorId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "higherIsBetter",
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
      name: "identityKind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(IdentityKind) },
    },
    {
      name: "isRankable",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "levelTerm",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "numeratorId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "perFactor",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "topicTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "unitId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
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
      any: false,
      comparisons: [
        {
          left: { field: "identityKind" },
          operator: "equal",
          right: { literal: "metric" },
        },
      ],
    },
  ],
});
