import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { IdentityKind } from "#/modules/shared/schema/enum/identity-kind.enum.ts";
import { Aggregation } from "#/modules/statistics/schema/enum/aggregation.enum.ts";
import { Frequency } from "#/modules/statistics/schema/enum/frequency.enum.ts";
import { identitiesExample } from "@test/modules/identity/schema/dto/examples/identities.dto.example.ts";
import { unitsExample } from "@test/modules/reference/schema/dto/examples/units.dto.example.ts";
import { identityEntityExample } from "@test/modules/shared/schema/dto/examples/identity-entity.dto.example.ts";
import { termsExample } from "@test/modules/vocabulary/schema/dto/examples/terms.dto.example.ts";

/** The contract shape of Indicators, for generated tests. */
export const indicatorsExample: ContractExample = contractExample({
  name: "Indicators",
  fields: [
    {
      name: "aggregation",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(Aggregation) },
    },
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
      name: "decimals",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0, max: 10 },
    },
    {
      name: "deletedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "frequency",
      optional: true,
      nullable: true,
      spec: { kind: "enum", values: Object.values(Frequency) },
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
      name: "isDerived",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "kindTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "roleTerm",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
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
          right: { literal: "indicator" },
        },
      ],
    },
  ],
});
