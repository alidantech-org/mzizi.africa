import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { governanceTreeNodesBodyExample } from "@test/modules/insights/schema/dto/examples/governance-tree-nodes-body.dto.example.ts";
import { governanceTreeNodesHowExample } from "@test/modules/insights/schema/dto/examples/governance-tree-nodes-how.dto.example.ts";
import { governanceTreeNodesPerformanceExample } from "@test/modules/insights/schema/dto/examples/governance-tree-nodes-performance.dto.example.ts";
import { governanceTreeNodesRefsExample } from "@test/modules/insights/schema/dto/examples/governance-tree-nodes-refs.dto.example.ts";
import { governanceTreeNodesTierExample } from "@test/modules/insights/schema/dto/examples/governance-tree-nodes-tier.dto.example.ts";
import { governanceTreeNodesUnitExample } from "@test/modules/insights/schema/dto/examples/governance-tree-nodes-unit.dto.example.ts";

/** The contract shape of GovernanceTreeNodes, for generated tests. */
export const governanceTreeNodesExample: ContractExample = contractExample({
  name: "GovernanceTreeNodes",
  fields: [
    {
      name: "arm",
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "basis",
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "body",
      optional: true,
      nullable: false,
      spec: { kind: "schema", example: () => governanceTreeNodesBodyExample },
    },
    {
      name: "code",
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "holderId",
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "how",
      optional: true,
      nullable: false,
      spec: { kind: "schema", example: () => governanceTreeNodesHowExample },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "kind",
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "leaderSlug",
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "leaders",
      optional: true,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "level",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "party",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "performance",
      optional: true,
      nullable: true,
      spec: {
        kind: "schema",
        example: () => governanceTreeNodesPerformanceExample,
      },
    },
    {
      name: "photo",
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "purpose",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "refs",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => governanceTreeNodesRefsExample },
    },
    {
      name: "since",
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "tier",
      optional: true,
      nullable: false,
      spec: { kind: "schema", example: () => governanceTreeNodesTierExample },
    },
    {
      name: "type",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "unit",
      optional: true,
      nullable: false,
      spec: { kind: "schema", example: () => governanceTreeNodesUnitExample },
    },
  ],
  invariants: [],
});
