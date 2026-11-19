import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { electionDetailUnitsCandidatesExample } from "@test/modules/insights/schema/dto/examples/election-detail-units-candidates.dto.example.ts";
import { electionDetailUnitsWinnerExample } from "@test/modules/insights/schema/dto/examples/election-detail-units-winner.dto.example.ts";

/** The contract shape of ElectionDetailUnits, for generated tests. */
export const electionDetailUnitsExample: ContractExample = contractExample({
  name: "ElectionDetailUnits",
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
        example: () => electionDetailUnitsCandidatesExample,
      },
    },
    {
      name: "featureId",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "geometry",
      optional: true,
      nullable: true,
      spec: { kind: "unknown" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "path",
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
      name: "rejected",
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
    {
      name: "validVotes",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "winner",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => electionDetailUnitsWinnerExample },
    },
  ],
  invariants: [],
});
