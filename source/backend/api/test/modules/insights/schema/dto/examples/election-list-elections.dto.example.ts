import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { electionListElectionsRunnerUpExample } from "@test/modules/insights/schema/dto/examples/election-list-elections-runner-up.dto.example.ts";
import { electionListElectionsWinnerExample } from "@test/modules/insights/schema/dto/examples/election-list-elections-winner.dto.example.ts";

/** The contract shape of ElectionListElections, for generated tests. */
export const electionListElectionsExample: ContractExample = contractExample({
  name: "ElectionListElections",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "contests",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
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
      name: "registeredVoters",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "runnerUp",
      optional: true,
      nullable: true,
      spec: {
        kind: "schema",
        example: () => electionListElectionsRunnerUpExample,
      },
    },
    {
      name: "validVotes",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "winner",
      optional: true,
      nullable: true,
      spec: {
        kind: "schema",
        example: () => electionListElectionsWinnerExample,
      },
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
