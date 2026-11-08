import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { AccountStatus } from "#/types/identity/account-status.enum.ts";
import { baseEntityExample } from "#/modules/shared/dto/base-entity.dto.example.ts";

/** The contract shape of Account, for generated tests. */
export const accountExample: ContractExample = contractExample({
  name: "Account",
  fields: [
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "issuer",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "lastSeenAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "personId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(AccountStatus) },
    },
    {
      name: "subject",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
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
  ],
  invariants: [
  ],
});