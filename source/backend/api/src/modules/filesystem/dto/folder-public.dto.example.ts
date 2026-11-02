import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { Visibility } from "#/types/filesystem/visibility.enum.ts";

/** The contract shape of FolderPublic, for generated tests. */
export const folderPublicExample: ContractExample = contractExample({
  name: "FolderPublic",
  fields: [
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "depth",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
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
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "parentId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "path",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 1000 },
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