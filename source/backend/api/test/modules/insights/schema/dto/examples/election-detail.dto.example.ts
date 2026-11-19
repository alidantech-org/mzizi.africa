import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { electionDetailContestsExample } from "@test/modules/insights/schema/dto/examples/election-detail-contests.dto.example.ts";
import { electionDetailElectionExample } from "@test/modules/insights/schema/dto/examples/election-detail-election.dto.example.ts";
import { electionDetailTotalsExample } from "@test/modules/insights/schema/dto/examples/election-detail-totals.dto.example.ts";
import { electionDetailUnitsExample } from "@test/modules/insights/schema/dto/examples/election-detail-units.dto.example.ts";

/** The contract shape of ElectionDetail, for generated tests. */
export const electionDetailExample: ContractExample = contractExample({
  name: "ElectionDetail",
  fields: [
    {
      name: "contests",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => electionDetailContestsExample },
    },
    {
      name: "election",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => electionDetailElectionExample },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "totals",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => electionDetailTotalsExample },
    },
    {
      name: "units",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => electionDetailUnitsExample },
    },
  ],
  invariants: [],
});
