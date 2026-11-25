import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { electionDetailContestsExample } from "@test/modules/election/schema/dto/examples/election-detail-contests.dto.example.ts";
import { electionDetailNamesExample } from "@test/modules/election/schema/dto/examples/election-detail-names.dto.example.ts";

/** The contract shape of ElectionDetail, for generated tests. */
export const electionDetailExample: ContractExample = contractExample({
  name: "ElectionDetail",
  fields: [
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
      name: "contests",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => electionDetailContestsExample },
    },
    {
      name: "electionId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "fromYear",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: -10000, max: 3000 },
    },
    {
      name: "heldOn",
      optional: false,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "kindTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "names",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => electionDetailNamesExample },
    },
    {
      name: "statusTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [],
});
