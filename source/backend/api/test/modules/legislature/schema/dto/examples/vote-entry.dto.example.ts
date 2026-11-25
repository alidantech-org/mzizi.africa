import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { VoteChoice } from "#/modules/legislature/schema/enum/vote-choice.enum.ts";

/** The contract shape of VoteEntry, for generated tests. */
export const voteEntryExample: ContractExample = contractExample({
  name: "VoteEntry",
  fields: [
    {
      name: "choice",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(VoteChoice) },
    },
    {
      name: "holderId",
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
