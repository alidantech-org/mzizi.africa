import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { accountsExample } from "@test/modules/auth/schema/dto/examples/accounts.dto.example.ts";
import { delegationsExample } from "@test/modules/auth/schema/dto/examples/delegations.dto.example.ts";
import { membershipsExample } from "@test/modules/auth/schema/dto/examples/memberships.dto.example.ts";
import { rolesExample } from "@test/modules/auth/schema/dto/examples/roles.dto.example.ts";
import { scopesExample } from "@test/modules/auth/schema/dto/examples/scopes.dto.example.ts";
import { createdExample } from "@test/modules/shared/schema/dto/examples/created.dto.example.ts";

/** The contract shape of Grants, for generated tests. */
export const grantsExample: ContractExample = contractExample({
  name: "Grants",
  fields: [
    {
      name: "accountId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "delegationId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "expiresAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "grantedBy",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "membershipId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "revocationReason",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 4000 },
    },
    {
      name: "revokedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "revokedBy",
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
      name: "scopeId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "startsAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
  ],
  invariants: [],
});
