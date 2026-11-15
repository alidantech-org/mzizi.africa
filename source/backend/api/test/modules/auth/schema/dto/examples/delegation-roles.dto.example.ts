import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { delegationsExample } from "@test/modules/auth/schema/dto/examples/delegations.dto.example.ts";
import { rolesExample } from "@test/modules/auth/schema/dto/examples/roles.dto.example.ts";

/** The contract shape of DelegationRoles, for generated tests. */
export const delegationRolesExample: ContractExample = contractExample({
  name: "DelegationRoles",
  fields: [
    {
      name: "delegationId",
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
