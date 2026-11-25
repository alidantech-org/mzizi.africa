import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { electionDetailContestsCandidatesNamesExample } from "@test/modules/election/schema/dto/examples/election-detail-contests-candidates-names.dto.example.ts";

/** The contract shape of ElectionDetailContestsCandidates, for generated tests. */
export const electionDetailContestsCandidatesExample: ContractExample = contractExample({
  name: "ElectionDetailContestsCandidates",
  fields: [
    {
      name: "ballotOrder",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: 1 },
    },
    {
      name: "candidateId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "individualId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "names",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => electionDetailContestsCandidatesNamesExample,
      },
    },
    {
      name: "partyCode",
      optional: false,
      nullable: true,
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
      name: "partyId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [],
});
