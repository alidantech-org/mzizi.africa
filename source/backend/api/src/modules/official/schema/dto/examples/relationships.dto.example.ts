import { type ContractExample, contractExample } from "#/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of Relationships, for generated tests. */
export const relationshipsExample: ContractExample = contractExample({
  name: "Relationships",
  fields: [
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "deletedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "fromEntityId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "fromIndividualId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "kindId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "sharePercentage",
      optional: true,
      nullable: true,
      spec: { kind: "number", min: 0, max: 100 },
    },
    {
      name: "sourceCitationId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "toEntityId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "toIndividualId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "validFrom",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "validUntil",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "version",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1 },
    },
  ],
  invariants: [
    {
      any: true,
      comparisons: [
        { left: { field: "validFrom" }, operator: "equal", right: { literal: null } },
        { left: { field: "validUntil" }, operator: "equal", right: { literal: null } },
        { left: { field: "validFrom" }, operator: "less-than", right: { field: "validUntil" } },
      ],
    },
    {
      any: false,
      comparisons: [
        { left: { field: "fromEntityId" }, operator: "not-equal", right: { field: "toEntityId" } },
        { left: { field: "fromIndividualId" }, operator: "not-equal", right: { field: "toIndividualId" } },
      ],
    },
  ],
});