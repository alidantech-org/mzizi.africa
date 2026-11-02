import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { FormatCategory } from "#/types/filesystem/format-category.enum.ts";
import { baseEntityExample } from "#/modules/shared/dto/base-entity.dto.example.ts";

/** The contract shape of Format, for generated tests. */
export const formatExample: ContractExample = contractExample({
  name: "Format",
  fields: [
    {
      name: "category",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(FormatCategory) },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 200 },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "extension",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 20 },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "isPreviewable",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "maxSizeBytes",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "mimeType",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 3, maxLength: 200 },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "processingStrategy",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
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