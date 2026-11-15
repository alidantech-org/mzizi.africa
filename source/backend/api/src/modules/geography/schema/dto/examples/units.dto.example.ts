import { type ContractExample, contractExample } from "#/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of Units, for generated tests. */
export const unitsExample: ContractExample = contractExample({
  name: "Units",
  fields: [
    {
      name: "countryId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "featureId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
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
  ],
});