import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { MembershipBasis } from "#/types/website/membership-basis.enum.ts";
import { RelationOwnerKind } from "#/types/website/relation-owner-kind.enum.ts";
import { SiteRelationKind } from "#/types/website/site-relation-kind.enum.ts";

/** The contract shape of SiteRelationPublic, for generated tests. */
export const siteRelationPublicExample: ContractExample = contractExample({
  name: "SiteRelationPublic",
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
      name: "evidence",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1 },
    },
    {
      name: "fromId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "fromKind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(RelationOwnerKind) },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "relation",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(SiteRelationKind) },
    },
    {
      name: "score",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "toId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "toKind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(RelationOwnerKind) },
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