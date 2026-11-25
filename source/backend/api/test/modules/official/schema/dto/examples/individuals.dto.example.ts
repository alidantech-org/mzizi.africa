import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { IdentityKind } from "#/modules/shared/schema/enum/identity-kind.enum.ts";
import { identitiesExample } from "@test/modules/identity/schema/dto/examples/identities.dto.example.ts";
import { identityEntityExample } from "@test/modules/shared/schema/dto/examples/identity-entity.dto.example.ts";

/** The contract shape of Individuals, for generated tests. */
export const individualsExample: ContractExample = contractExample({
  name: "Individuals",
  fields: [
    {
      name: "birthDate",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "birthYear",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: -10000, max: 3000 },
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
      name: "deathDate",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "deathYear",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: -10000, max: 3000 },
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
      name: "identityKind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(IdentityKind) },
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
          right: { literal: "individual" },
        },
      ],
    },
    {
      any: true,
      comparisons: [
        {
          left: { field: "birthYear" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "deathYear" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "birthYear" },
          operator: "less-than-or-equal",
          right: { field: "deathYear" },
        },
      ],
    },
    {
      any: true,
      comparisons: [
        {
          left: { field: "birthDate" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "deathDate" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "birthDate" },
          operator: "less-than-or-equal",
          right: { field: "deathDate" },
        },
      ],
    },
  ],
});
