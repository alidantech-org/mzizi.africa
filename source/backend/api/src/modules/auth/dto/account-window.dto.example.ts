import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { AccountStatus } from "#/modules/auth/account-status.enum.ts";

/** The contract shape of AccountWindow, for generated tests. */
export const accountWindowExample: ContractExample = contractExample({
  name: "AccountWindow",
  fields: [
    {
      name: "limit",
      optional: true,
      nullable: false,
      spec: { kind: "number", integer: true },
    },
    {
      name: "offset",
      optional: true,
      nullable: false,
      spec: { kind: "number", integer: true },
    },
    {
      name: "status",
      optional: true,
      nullable: false,
      spec: { kind: "enum", values: Object.values(AccountStatus) },
    },
  ],
  invariants: [
  ],
});