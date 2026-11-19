import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { nearbyProjectsProjectsMediaExample } from "@test/modules/insights/schema/dto/examples/nearby-projects-projects-media.dto.example.ts";

/** The contract shape of NearbyProjectsProjects, for generated tests. */
export const nearbyProjectsProjectsExample: ContractExample = contractExample({
  name: "NearbyProjectsProjects",
  fields: [
    {
      name: "amount",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "contractor",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "distanceKm",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "location",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
    {
      name: "media",
      optional: false,
      nullable: false,
      spec: {
        kind: "schema",
        example: () => nearbyProjectsProjectsMediaExample,
      },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "responsible",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "unit",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "unitId",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "unitPath",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
