import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { leaderTreeLevelsUnitExample } from "@test/modules/insights/schema/dto/examples/leader-tree-levels-unit.dto.example.ts";

/** The contract shape of LeaderTreeLevels, for generated tests. */
export const leaderTreeLevelsExample: ContractExample = contractExample({
  name: "LeaderTreeLevels",
  fields: [
    {
      name: "groups",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
    {
      name: "label",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "level",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "total",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "unit",
      optional: true,
      nullable: true,
      spec: { kind: "schema", example: () => leaderTreeLevelsUnitExample },
    },
  ],
  invariants: [],
});
