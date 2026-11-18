import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeCrumbExample } from "@test/modules/insights/schema/dto/examples/place-crumb.dto.example.ts";

/** The contract shape of PlaceElections, for generated tests. */
export const placeElectionsExample: ContractExample = contractExample({
  name: "PlaceElections",
  fields: [
    {
      name: "elections",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "place",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => placeCrumbExample },
    },
    {
      name: "registrationTrend",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "turnoutTrend",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
  ],
  invariants: [],
});
