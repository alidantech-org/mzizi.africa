import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { governanceTreeEdgesExample } from "@test/modules/insights/schema/dto/examples/governance-tree-edges.dto.example.ts";
import { governanceTreeLegendExample } from "@test/modules/insights/schema/dto/examples/governance-tree-legend.dto.example.ts";
import { governanceTreeNodesExample } from "@test/modules/insights/schema/dto/examples/governance-tree-nodes.dto.example.ts";
import { governanceTreeRailExample } from "@test/modules/insights/schema/dto/examples/governance-tree-rail.dto.example.ts";
import { governanceTreeTabExample } from "@test/modules/insights/schema/dto/examples/governance-tree-tab.dto.example.ts";
import { placeCrumbExample } from "@test/modules/insights/schema/dto/examples/place-crumb.dto.example.ts";

/** The contract shape of GovernanceTree, for generated tests. */
export const governanceTreeExample: ContractExample = contractExample({
  name: "GovernanceTree",
  fields: [
    {
      name: "edges",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => governanceTreeEdgesExample },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "legend",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => governanceTreeLegendExample },
    },
    {
      name: "nodes",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => governanceTreeNodesExample },
    },
    {
      name: "place",
      optional: true,
      nullable: true,
      spec: { kind: "schema", example: () => placeCrumbExample },
    },
    {
      name: "rail",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => governanceTreeRailExample },
    },
    {
      name: "tab",
      optional: true,
      nullable: true,
      spec: { kind: "schema", example: () => governanceTreeTabExample },
    },
  ],
  invariants: [],
});
