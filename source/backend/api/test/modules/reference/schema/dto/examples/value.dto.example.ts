import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { schemeExample } from "@test/modules/reference/schema/dto/examples/scheme.dto.example.ts";
import { codedEntityExample } from "@test/modules/shared/schema/dto/examples/coded-entity.dto.example.ts";

/** The contract shape of Value, for generated tests. */
export const valueExample: ContractExample = contractExample({
  name: "Value",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: {
        kind: "string",
        minLength: 1,
        maxLength: 255,
        patterns: ["^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$"],
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
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "label",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "schemeId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "supersedesId",
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
          left: { field: "id" },
          operator: "not-equal",
          right: { field: "supersedesId" },
        },
      ],
    },
  ],
});
