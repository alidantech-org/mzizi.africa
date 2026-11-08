import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import { StructureFileRole } from "#/types/website/structure-file-role.enum.ts";
import { baseQueryExample } from "#/modules/shared/dto/base-query.dto.example.ts";

/** The contract shape of StructureFileListQuery, for generated tests. */
export const structureFileListQueryExample: ContractExample = contractExample({
  name: "StructureFileListQuery",
  fields: [
    {
      name: "includeHistory",
      optional: true,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "limit",
      optional: true,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1000 },
    },
    {
      name: "order",
      optional: true,
      nullable: false,
      spec: { kind: "enum", values: Object.values(SortDirection) },
    },
    {
      name: "page",
      optional: true,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1000 },
    },
    {
      name: "role",
      optional: true,
      nullable: false,
      spec: { kind: "enum", values: Object.values(StructureFileRole) },
    },
    {
      name: "sort",
      optional: true,
      nullable: false,
      spec: { kind: "enum", values: Object.values(SortDirection) },
    },
    {
      name: "versionId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [
  ],
});