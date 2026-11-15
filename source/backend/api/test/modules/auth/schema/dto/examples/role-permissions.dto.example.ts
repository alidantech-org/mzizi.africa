import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { accountsExample } from "@test/modules/auth/schema/dto/examples/accounts.dto.example.ts";
import { permissionsExample } from "@test/modules/auth/schema/dto/examples/permissions.dto.example.ts";
import { rolesExample } from "@test/modules/auth/schema/dto/examples/roles.dto.example.ts";

/** The contract shape of RolePermissions, for generated tests. */
export const rolePermissionsExample: ContractExample = contractExample({
  name: "RolePermissions",
  fields: [
    {
      name: "grantedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "grantedBy",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "permissionId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "roleId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [],
});
