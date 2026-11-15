import { type ContractExample, contractExample } from "#/modules/common/schema/dto/testing/examples.ts";
import { AuthAction } from "#/modules/auth/schema/enum/auth-action.enum.ts";

/** The contract shape of Permissions, for generated tests. */
export const permissionsExample: ContractExample = contractExample({
  name: "Permissions",
  fields: [
    {
      name: "action",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(AuthAction) },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255, patterns: ["^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"] },
    },
    {
      name: "description",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 4000 },
    },
    {
      name: "fieldGroup",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "isActive",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "resourceType",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
  ],
  invariants: [
  ],
});