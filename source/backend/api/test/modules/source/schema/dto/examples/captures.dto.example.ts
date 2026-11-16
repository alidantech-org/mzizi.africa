import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { codedEntityExample } from "@test/modules/shared/schema/dto/examples/coded-entity.dto.example.ts";
import { documentsExample } from "@test/modules/source/schema/dto/examples/documents.dto.example.ts";
import { manifestReleasesExample } from "@test/modules/source/schema/dto/examples/manifest-releases.dto.example.ts";
import { pathsExample } from "@test/modules/source/schema/dto/examples/paths.dto.example.ts";
import { sourcesExample } from "@test/modules/source/schema/dto/examples/sources.dto.example.ts";

/** The contract shape of Captures, for generated tests. */
export const capturesExample: ContractExample = contractExample({
  name: "Captures",
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
      name: "documentId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "manifestReleaseId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "originalUrl",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "url", maxLength: 2048 },
    },
    {
      name: "pathId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "responseMetadata",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "json" },
    },
    {
      name: "retrievedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "retrievedUrl",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "url", maxLength: 2048 },
    },
    {
      name: "sourceId",
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
  ],
  invariants: [],
});
