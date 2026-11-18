import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { leaderboardMetricExample } from "@test/modules/insights/schema/dto/examples/leaderboard-metric.dto.example.ts";

/** The contract shape of LeaderboardMetricList, for generated tests. */
export const leaderboardMetricListExample: ContractExample = contractExample({
  name: "LeaderboardMetricList",
  fields: [
    {
      name: "metrics",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => leaderboardMetricExample },
    },
  ],
  invariants: [],
});
