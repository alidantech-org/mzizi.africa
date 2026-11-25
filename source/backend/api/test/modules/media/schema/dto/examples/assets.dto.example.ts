import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { AssetKind } from "#/modules/media/schema/enum/asset-kind.enum.ts";
import { Availability } from "#/modules/media/schema/enum/availability.enum.ts";
import { versionsExample } from "@test/modules/filesystem/schema/dto/examples/versions.dto.example.ts";
import { codedEntityExample } from "@test/modules/shared/schema/dto/examples/coded-entity.dto.example.ts";
import { termsExample } from "@test/modules/vocabulary/schema/dto/examples/terms.dto.example.ts";

/** The contract shape of Assets, for generated tests. */
export const assetsExample: ContractExample = contractExample({
  name: "Assets",
  fields: [
    {
      name: "author",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "availability",
      optional: true,
      nullable: true,
      spec: { kind: "enum", values: Object.values(Availability) },
    },
    {
      name: "capturedOn",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "checkedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
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
      name: "deletedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "duration",
      optional: true,
      nullable: true,
      spec: { kind: "number", min: 0 },
    },
    {
      name: "embedUrl",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "url", maxLength: 2048 },
    },
    {
      name: "endSecond",
      optional: true,
      nullable: true,
      spec: { kind: "number", min: 0 },
    },
    {
      name: "externalId",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "externalUrl",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "url", maxLength: 2048 },
    },
    {
      name: "height",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 1 },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(AssetKind) },
    },
    {
      name: "kindTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "licenceTerm",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "providerTerm",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "publishedOn",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "startSecond",
      optional: true,
      nullable: true,
      spec: { kind: "number", min: 0 },
    },
    {
      name: "thumbnailUrl",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "url", maxLength: 2048 },
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
    {
      name: "width",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 1 },
    },
  ],
  invariants: [
    {
      any: true,
      comparisons: [
        {
          left: { field: "kind" },
          operator: "not-equal",
          right: { literal: "held" },
        },
        {
          left: { field: "versionId" },
          operator: "not-equal",
          right: { literal: null },
        },
      ],
    },
    {
      any: true,
      comparisons: [
        {
          left: { field: "kind" },
          operator: "equal",
          right: { literal: "held" },
        },
        {
          left: { field: "externalUrl" },
          operator: "not-equal",
          right: { literal: null },
        },
      ],
    },
    {
      any: true,
      comparisons: [
        {
          left: { field: "startSecond" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "endSecond" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "startSecond" },
          operator: "less-than",
          right: { field: "endSecond" },
        },
      ],
    },
  ],
});
