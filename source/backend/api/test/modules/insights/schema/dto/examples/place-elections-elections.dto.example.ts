import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeElectionsElectionsContestsExample } from "@test/modules/insights/schema/dto/examples/place-elections-elections-contests.dto.example.ts";

/** The contract shape of PlaceElectionsElections, for generated tests. */
export const placeElectionsElectionsExample: ContractExample = contractExample({
  name: "PlaceElectionsElections",
  fields: [
    {
      name: "contests",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => placeElectionsElectionsContestsExample,
      },
    },
    {
      name: "electionId",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "heldOn",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "year",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
