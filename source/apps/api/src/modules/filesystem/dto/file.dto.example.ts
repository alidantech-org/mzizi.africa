import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { FileStatus } from "#/types/filesystem/file-status.enum.ts";
import { Visibility } from "#/types/filesystem/visibility.enum.ts";
import { folderExample } from "#/modules/filesystem/dto/folder.dto.example.ts";
import { baseEntityExample } from "#/modules/shared/dto/base-entity.dto.example.ts";

/** The contract shape of File, for generated tests. */
export const fileExample: ContractExample = contractExample({
  name: "File",
  fields: [
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "currentVersionId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
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
      name: "isLegalHold",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "ownerAccountId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(FileStatus) },
    },
    {
      name: "trashedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "version",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "visibility",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(Visibility) },
    },
  ],
  invariants: [
  ],
});