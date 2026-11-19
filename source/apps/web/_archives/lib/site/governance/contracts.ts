/** Named read documents for dynamic sections of the generated governance operations. */
export interface Label {
  code: string;
  label: string;
}
export interface Place {
  featureId: string;
  path?: string | null;
  name: string;
  kindLabel: string;
  kindCode: string;
}
export interface InstitutionCard {
  code: string;
  name: string;
  kind: Label;
  arm?: Label | null;
  basis?: Label | null;
  parent: { code: string; name: string } | null;
  leaders: number;
  children: number;
  purpose?: string | null;
  image?: string | null;
}
export interface InstitutionGroup {
  kind: Label;
  institutions: InstitutionCard[];
}
export interface InstitutionArm {
  code: string;
  label: string;
  about?: string | null;
  count: number;
  groups: InstitutionGroup[];
}
export interface Directory {
  arms: InstitutionArm[];
  total: number;
  gaps: string[];
}
export interface LegalItem {
  effect: string;
  designation: string;
  heading?: string | null;
  instrument: string;
  instrumentCode?: string | null;
  provisionCode?: string | null;
  excerpt: string;
  explanation?: string | null;
  reviewStatus: string;
  via?: string | null;
}
export interface ContentItem {
  code: string;
  slug: string;
  language: string;
  title: string;
  summary?: string | null;
  category: Label;
  classification?: { code: string; label: string } | null;
  body: string;
  image?: string | null;
  tags: string[];
  isDevelopmentText: boolean;
  subject: { table: string; code?: string | null };
  unresolvedMedia: string[];
}
export interface ContentPage {
  content?: ContentItem | null;
  related: ContentItem[];
  gaps: string[];
}
export interface ContentLibrary {
  categories: (Label & { count: number })[];
  items: ContentItem[];
  gaps: string[];
}
export interface InstitutionLeader {
  holderId: string;
  leaderSlug?: string | null;
  name: string;
  party?: string | null;
  tier: Label;
  how: Label;
  unit: { featureId: string; name: string } | null;
  since?: string | null;
  photo?: string | null;
}
export interface InstitutionRelation {
  code: string;
  name: string;
  relation: Label;
  children: number;
}
export interface InstitutionProfile {
  institution: InstitutionCard & {
    established?: string | null;
    functions: string[];
  };
  leaders: InstitutionLeader[];
  legalBasis: LegalItem[];
  content: ContentItem[];
  parents: InstitutionRelation[];
  children: InstitutionRelation[];
  metrics: { label: string; value: number }[];
  gaps: string[];
}
export interface TreeTab {
  code: string;
  label: string;
  about?: string | null;
  count: number;
  includes: string[];
}
export interface TreeOptions {
  tabs: TreeTab[];
  arms: {
    code: string;
    label: string;
    institutions: { code: string; name: string; leaders: number }[];
  }[];
  gaps: string[];
}
export interface TreeRefs {
  table?: string | null;
  code?: string | null;
  office?: string | null;
  tier?: string | null;
  appointment?: string | null;
  institution?: string | null;
  scheme?: string | null;
}
export interface NodeBase {
  id: string;
  name: string;
  level: string;
  refs: TreeRefs;
}
export interface GroupNode extends NodeBase {
  type: "root" | "arm";
}
export interface BodyNode extends NodeBase {
  type: "body";
  code: string;
  purpose?: string | null;
  kind?: string | null;
  arm?: string | null;
  basis?: string | null;
  leaders: number;
}
export interface LeaderNode extends NodeBase {
  type: "leader";
  holderId: string;
  leaderSlug?: string | null;
  party?: string | null;
  photo?: string | null;
  since?: string | null;
  tier: Label;
  how: Label;
  unit: { featureId: string; name: string } | null;
  body: { code: string; name: string };
  performance: {
    score: number;
    rank: number;
    of: number;
    samples: number;
    text: string;
    basis: string;
  } | null;
}
export type TreeNode = GroupNode | BodyNode | LeaderNode;
export interface TreeEdge {
  from: string;
  to: string;
  kind: string;
}
export interface TreeRail extends Label {
  about?: string | null;
  count: number;
  unit?: Place | null;
}
export interface GovernanceTree {
  tab?: (Label & { about: string | null }) | null;
  place?: Place | null;
  nodes: TreeNode[];
  edges: TreeEdge[];
  rail: TreeRail[];
  legend: Label[];
  gaps: string[];
}
export interface CompareMetric {
  code: string;
  title: string;
  unit?: string | null;
  describe: string;
  higherIsBetter: boolean;
}
export interface CompareSuggestion {
  featureId?: string | null;
  name: string;
  distanceKm?: number | null;
  rank?: number | null;
  value?: number | null;
}
export interface CompareRung {
  rung: string;
  label: string;
  available: boolean;
  unit?: Place | null;
  message?: string | null;
}
export interface CompareOptions {
  place?: Place | null;
  nearby: CompareSuggestion[];
  top: CompareSuggestion[];
  hierarchy: CompareRung[];
  metrics: CompareMetric[];
  gaps: string[];
}
export interface ComparisonRow {
  code: string;
  title: string;
  unit?: string | null;
  higherIsBetter: boolean;
  a?: number | null;
  b?: number | null;
  diffPercent?: number | null;
}
export interface Comparison {
  a?: Place | null;
  b?: Place | null;
  rows: ComparisonRow[];
  gaps: string[];
}
export interface LegalBasis {
  items: LegalItem[];
  gaps: string[];
}
