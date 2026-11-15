import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { AccountStatus } from "#/modules/auth/schema/enum/account-status.enum.ts";
import { pageWindowExample } from "@test/modules/shared/schema/dto/examples/page-window.dto.example.ts";

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
  invariants: [],
});
