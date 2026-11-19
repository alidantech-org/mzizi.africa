import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { governanceTreeRailRefsExample } from "@test/modules/insights/schema/dto/examples/governance-tree-rail-refs.dto.example.ts";
import { governanceTreeRailUnitExample } from "@test/modules/insights/schema/dto/examples/governance-tree-rail-unit.dto.example.ts";

/** The contract shape of GovernanceTreeRail, for generated tests. */
export const governanceTreeRailExample: ContractExample = contractExample({
  name: "GovernanceTreeRail",
  fields: [
    {
      name: "about",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "count",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "label",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "refs",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => governanceTreeRailRefsExample },
    },
    {
      name: "unit",
      optional: true,
      nullable: true,
      spec: { kind: "schema", example: () => governanceTreeRailUnitExample },
    },
  ],
  invariants: [],
});
