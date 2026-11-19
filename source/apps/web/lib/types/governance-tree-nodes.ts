import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type GovernanceTreeNodesBody } from "#/lib/types/governance-tree-nodes-body.ts";
import { type GovernanceTreeNodesHow } from "#/lib/types/governance-tree-nodes-how.ts";
import { type GovernanceTreeNodesPerformance } from "#/lib/types/governance-tree-nodes-performance.ts";
import { type GovernanceTreeNodesRefs } from "#/lib/types/governance-tree-nodes-refs.ts";
import { type GovernanceTreeNodesTier } from "#/lib/types/governance-tree-nodes-tier.ts";
import { type GovernanceTreeNodesUnit } from "#/lib/types/governance-tree-nodes-unit.ts";

/** Governance Tree Nodes */
export interface GovernanceTreeNodes {
  arm?: string;
  basis?: string;
  body?: GovernanceTreeNodesBody;
  code?: string;
  holderId?: string;
  how?: GovernanceTreeNodesHow;
  id: string;
  kind?: string;
  leaderSlug?: string;
  leaders?: number;
  level: string;
  name: string;
  party?: string | null;
  performance?: GovernanceTreeNodesPerformance | null;
  photo?: string;
  purpose?: string | null;
  refs: GovernanceTreeNodesRefs;
  since?: string;
  tier?: GovernanceTreeNodesTier;
  type: string;
  unit?: GovernanceTreeNodesUnit;
}

/** Field metadata for forms and results. */
export const GovernanceTreeNodesFields: readonly FieldMeta[] = [
  { name: "arm", label: "Arm", kind: "string", required: false },
  { name: "basis", label: "Basis", kind: "string", required: false },
  { name: "body", label: "Body", kind: "other", required: false },
  { name: "code", label: "Code", kind: "string", required: false },
  { name: "holderId", label: "Holder Id", kind: "string", required: false },
  { name: "how", label: "How", kind: "other", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "kind", label: "Kind", kind: "string", required: false },
  { name: "leaderSlug", label: "Leader Slug", kind: "string", required: false },
  { name: "leaders", label: "Leaders", kind: "number", required: false },
  { name: "level", label: "Level", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "party", label: "Party", kind: "string", required: false },
  { name: "performance", label: "Performance", kind: "other", required: false },
  { name: "photo", label: "Photo", kind: "string", required: false },
  { name: "purpose", label: "Purpose", kind: "string", required: false },
  { name: "refs", label: "Refs", kind: "other", required: true },
  { name: "since", label: "Since", kind: "string", required: false },
  { name: "tier", label: "Tier", kind: "other", required: false },
  { name: "type", label: "Type", kind: "string", required: true },
  { name: "unit", label: "Unit", kind: "other", required: false },
];
