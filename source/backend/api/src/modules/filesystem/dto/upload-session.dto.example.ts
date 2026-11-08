import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { UploadState } from "#/types/filesystem/upload-state.enum.ts";
import { baseEntityExample } from "#/modules/shared/dto/base-entity.dto.example.ts";

/** The contract shape of UploadSession, for generated tests. */
export const uploadSessionExample: ContractExample = contractExample({
  name: "UploadSession",
  fields: [
    {
      name: "completedFileId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "expectedHash",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 64, maxLength: 64 },
    },
    {
      name: "expectedSizeBytes",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "expiresAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "fileName",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
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
      name: "requestedBy",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "state",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(UploadState) },
    },
    {
      name: "storeId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
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
  ],
  invariants: [
  ],
});