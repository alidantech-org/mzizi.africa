import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { electionDetailContestsCandidatesExample } from "@test/modules/election/schema/dto/examples/election-detail-contests-candidates.dto.example.ts";

/** The contract shape of ElectionDetailContests, for generated tests. */
export const electionDetailContestsExample: ContractExample = contractExample({
  name: "ElectionDetailContests",
  fields: [
    {
      name: "candidates",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => electionDetailContestsCandidatesExample,
      },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: {
        kind: "string",
        minLength: 1,
        maxLength: 255,
        patterns: [
          "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ],
      },
    },
    {
      name: "contestId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "featureId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "kindTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "officeId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [],
});
