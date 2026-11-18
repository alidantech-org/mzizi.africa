import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { leaderboardMetricExample } from "@test/modules/insights/schema/dto/examples/leaderboard-metric.dto.example.ts";
import { leaderboardRowExample } from "@test/modules/insights/schema/dto/examples/leaderboard-row.dto.example.ts";

/** The contract shape of Leaderboard, for generated tests. */
export const leaderboardExample: ContractExample = contractExample({
  name: "Leaderboard",
  fields: [
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "metric",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => leaderboardMetricExample },
    },
    {
      name: "rows",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => leaderboardRowExample },
    },
    {
      name: "scope",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
  ],
  invariants: [],
});
