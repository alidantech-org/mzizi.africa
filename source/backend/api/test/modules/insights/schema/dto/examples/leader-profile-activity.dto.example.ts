import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { leaderProfileActivityContributionsExample } from "@test/modules/insights/schema/dto/examples/leader-profile-activity-contributions.dto.example.ts";
import { leaderProfileActivityRecentExample } from "@test/modules/insights/schema/dto/examples/leader-profile-activity-recent.dto.example.ts";
import { leaderProfileActivitySpeechesExample } from "@test/modules/insights/schema/dto/examples/leader-profile-activity-speeches.dto.example.ts";
import { leaderProfileActivityVotesExample } from "@test/modules/insights/schema/dto/examples/leader-profile-activity-votes.dto.example.ts";

/** The contract shape of LeaderProfileActivity, for generated tests. */
export const leaderProfileActivityExample: ContractExample = contractExample({
  name: "LeaderProfileActivity",
  fields: [
    {
      name: "contributions",
      optional: false,
      nullable: false,
      spec: {
        kind: "schema",
        example: () => leaderProfileActivityContributionsExample,
      },
    },
    {
      name: "recent",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => leaderProfileActivityRecentExample,
      },
    },
    {
      name: "recorded",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "speeches",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => leaderProfileActivitySpeechesExample,
      },
    },
    {
      name: "votes",
      optional: false,
      nullable: false,
      spec: {
        kind: "schema",
        example: () => leaderProfileActivityVotesExample,
      },
    },
  ],
  invariants: [],
});
