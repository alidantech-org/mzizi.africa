import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { ScanStatus } from "#/types/filesystem/scan-status.enum.ts";
import { storeExample } from "#/modules/filesystem/dto/store.dto.example.ts";
import { baseEntityExample } from "#/modules/shared/dto/base-entity.dto.example.ts";

/** The contract shape of StoredObject, for generated tests. */
export const storedObjectExample: ContractExample = contractExample({
  name: "StoredObject",
  fields: [
    {
      name: "contentHash",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 64, maxLength: 64 },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "durationSeconds",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "formatId",
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
      name: "mediaHeight",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "mediaWidth",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "objectKey",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "pageCount",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "scanStatus",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(ScanStatus) },
    },
    {
      name: "sizeBytes",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
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