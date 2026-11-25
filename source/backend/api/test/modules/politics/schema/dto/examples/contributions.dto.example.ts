import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { electionsExample } from "@test/modules/election/schema/dto/examples/elections.dto.example.ts";
import { versionsExample } from "@test/modules/filesystem/schema/dto/examples/versions.dto.example.ts";
import { identitiesExample } from "@test/modules/identity/schema/dto/examples/identities.dto.example.ts";
import { currenciesExample } from "@test/modules/reference/schema/dto/examples/currencies.dto.example.ts";
import { codedEntityExample } from "@test/modules/shared/schema/dto/examples/coded-entity.dto.example.ts";
import { termsExample } from "@test/modules/vocabulary/schema/dto/examples/terms.dto.example.ts";

/** The contract shape of Contributions, for generated tests. */
export const contributionsExample: ContractExample = contractExample({
  name: "Contributions",
  fields: [
    {
      name: "amount",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
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
      name: "currencyId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "deletedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "donorId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "electionId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "givenOn",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "isInKind",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "recipientId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "statusTerm",
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
      name: "version",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1 },
    },
    {
      name: "versionId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [
    {
      any: true,
      comparisons: [
        {
          left: { field: "amount" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "currencyId" },
          operator: "not-equal",
          right: { literal: null },
        },
      ],
    },
  ],
});
