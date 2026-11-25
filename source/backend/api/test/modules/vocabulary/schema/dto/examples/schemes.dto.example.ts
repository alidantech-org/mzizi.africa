import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { SchemeAnswers } from "#/modules/vocabulary/schema/enum/scheme-answers.enum.ts";
import { SchemeShape } from "#/modules/vocabulary/schema/enum/scheme-shape.enum.ts";
import { identitiesExample } from "@test/modules/identity/schema/dto/examples/identities.dto.example.ts";
import { countriesExample } from "@test/modules/reference/schema/dto/examples/countries.dto.example.ts";
import { codedEntityExample } from "@test/modules/shared/schema/dto/examples/coded-entity.dto.example.ts";

/** The contract shape of Schemes, for generated tests. */
export const schemesExample: ContractExample = contractExample({
  name: "Schemes",
  fields: [
    {
      name: "answers",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(SchemeAnswers) },
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
      name: "countryId",
      optional: true,
      nullable: true,
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
      name: "isDated",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "isOpen",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "shape",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(SchemeShape) },
    },
    {
      name: "stewardId",
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
  invariants: [],
});
