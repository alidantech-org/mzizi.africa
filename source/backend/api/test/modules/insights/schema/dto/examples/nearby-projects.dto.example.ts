import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of NearbyProjects, for generated tests. */
export const nearbyProjectsExample: ContractExample = contractExample({
  name: "NearbyProjects",
  fields: [
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "projects",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "radiusKm",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
