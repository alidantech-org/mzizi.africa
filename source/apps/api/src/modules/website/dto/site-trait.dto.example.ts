import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { RelationOwnerKind } from "#/types/website/relation-owner-kind.enum.ts";
import { baseEntityExample } from "#/modules/shared/dto/base-entity.dto.example.ts";

/** The contract shape of SiteTrait, for generated tests. */
export const siteTraitExample: ContractExample = contractExample({
  name: "SiteTrait",
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
      name: "methodId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "observedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "ownerId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "ownerKind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(RelationOwnerKind) },
    },
    {
      name: "score",
      optional: true,
      nullable: true,
      spec: { kind: "number", min: 0, max: 1 },
    },
    {
      name: "tag",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 3, maxLength: 200 },
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