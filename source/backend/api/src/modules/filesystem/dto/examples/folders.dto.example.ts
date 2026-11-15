import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { Access } from "#/modules/filesystem/enum/access.enum.ts";

/** The contract shape of Folders, for generated tests. */
export const foldersExample: ContractExample = contractExample({
  name: "Folders",
  fields: [
    {
      name: "access",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(Access) },
    },
    {
      name: "authorization",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "json" },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255, patterns: ["^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"] },
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
      name: "parentId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "roleId",
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
  invariants: [
    {
      any: false,
      comparisons: [
        { left: { field: "id" }, operator: "not-equal", right: { field: "parentId" } },
      ],
    },
  ],
});