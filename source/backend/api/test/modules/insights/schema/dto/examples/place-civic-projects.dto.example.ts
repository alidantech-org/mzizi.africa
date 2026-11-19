import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeCivicProjectsMediaExample } from "@test/modules/insights/schema/dto/examples/place-civic-projects-media.dto.example.ts";

/** The contract shape of PlaceCivicProjects, for generated tests. */
export const placeCivicProjectsExample: ContractExample = contractExample({
  name: "PlaceCivicProjects",
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
      name: "completedOn",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "contractor",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "location",
      optional: true,
      nullable: true,
      spec: { kind: "unknown" },
    },
    {
      name: "media",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => placeCivicProjectsMediaExample },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "startedOn",
      optional: false,
      nullable: false,
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
