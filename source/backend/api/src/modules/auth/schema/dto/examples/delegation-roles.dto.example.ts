import { type ContractExample, contractExample } from "#/modules/common/schema/dto/testing/examples.ts";

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
  invariants: [
  ],
});