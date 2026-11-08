import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { StructureFileRole } from "#/types/website/structure-file-role.enum.ts";
import { baseEntityExample } from "#/modules/shared/dto/base-entity.dto.example.ts";

/** The contract shape of StructureFile, for generated tests. */
export const structureFileExample: ContractExample = contractExample({
  name: "StructureFile",
  fields: [
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "fileVersionId",
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
      name: "path",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "role",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(StructureFileRole) },
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
      name: "versionId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [
  ],
});