import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeElectionsElectionsContestsCandidatesExample } from "@test/modules/insights/schema/dto/examples/place-elections-elections-contests-candidates.dto.example.ts";

/** The contract shape of PlaceElectionsElectionsContests, for generated tests. */
export const placeElectionsElectionsContestsExample: ContractExample = contractExample({
  name: "PlaceElectionsElectionsContests",
  fields: [
    {
      name: "ballotsCast",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "candidates",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => placeElectionsElectionsContestsCandidatesExample,
      },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "registered",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "turnout",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
