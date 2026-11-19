import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeCrumbExample } from "@test/modules/insights/schema/dto/examples/place-crumb.dto.example.ts";
import { placeElectionsElectionsExample } from "@test/modules/insights/schema/dto/examples/place-elections-elections.dto.example.ts";
import { placeElectionsRegistrationTrendExample } from "@test/modules/insights/schema/dto/examples/place-elections-registration-trend.dto.example.ts";
import { placeElectionsTurnoutTrendExample } from "@test/modules/insights/schema/dto/examples/place-elections-turnout-trend.dto.example.ts";

/** The contract shape of PlaceElections, for generated tests. */
export const placeElectionsExample: ContractExample = contractExample({
  name: "PlaceElections",
  fields: [
    {
      name: "elections",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => placeElectionsElectionsExample },
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
      spec: {
        kind: "schema",
        example: () => placeElectionsRegistrationTrendExample,
      },
    },
    {
      name: "turnoutTrend",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => placeElectionsTurnoutTrendExample,
      },
    },
  ],
  invariants: [],
});
