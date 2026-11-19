import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PlaceCivicInfrastructure, for generated tests. */
export const placeCivicInfrastructureExample: ContractExample = contractExample({
  name: "PlaceCivicInfrastructure",
  fields: [
    {
      name: "areaKm2",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "completed",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "completionRate",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "per100k",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "perKm2",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "population",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "projectShare",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "projects",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "staffShare",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
