import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { MembershipBasis } from "#/types/website/membership-basis.enum.ts";
import { MembershipRole } from "#/types/website/membership-role.enum.ts";
import { baseEntityExample } from "#/modules/shared/dto/base-entity.dto.example.ts";
import { siteExample } from "#/modules/website/dto/site.dto.example.ts";

/** The contract shape of SiteMember, for generated tests. */
export const siteMemberExample: ContractExample = contractExample({
  name: "SiteMember",
  fields: [
    {
      name: "basis",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(MembershipBasis) },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "familyId",
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
      name: "methodId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "role",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(MembershipRole) },
    },
    {
      name: "score",
      optional: true,
      nullable: true,
      spec: { kind: "number", min: 0, max: 1 },
    },
    {
      name: "siteId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "validFrom",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "validTo",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
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