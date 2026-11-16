import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { Retention } from "#/modules/filesystem/schema/enum/retention.enum.ts";
import { fileVersionsExample } from "@test/modules/filesystem/schema/dto/examples/file-versions.dto.example.ts";
import { foldersExample } from "@test/modules/filesystem/schema/dto/examples/folders.dto.example.ts";
import { codedEntityExample } from "@test/modules/shared/schema/dto/examples/coded-entity.dto.example.ts";

/** The contract shape of Files, for generated tests. */
export const filesExample: ContractExample = contractExample({
  name: "Files",
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
      name: "currentVersionId",
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
      name: "folderId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "retention",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(Retention) },
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
