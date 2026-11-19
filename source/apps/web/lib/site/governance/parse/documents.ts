/** The parsing boundary for generated operations whose nested fields are dynamic. Raw JSON never escapes this module. */
import type * as C from "#/lib/site/governance/contracts.ts";

type Raw = Record<string, unknown>;
function obj(value: unknown): Raw {
  if (typeof value !== "object" || value === null || Array.isArray(value))
    throw new Error(
      "The server returned an incomplete document. Please retry.",
    );
  return value as Raw;
}
function list(v: unknown): unknown[] {
  if (!Array.isArray(v))
    throw new Error(
      "The server returned an incomplete collection. Please retry.",
    );
  return v;
}
function str(v: unknown): string {
  if (typeof v !== "string")
    throw new Error("The server returned an invalid text field. Please retry.");
  return v;
}
const nullable = (v: unknown): string | null =>
  typeof v === "string" ? v : null;
function num(v: unknown): number {
  if (typeof v !== "number" || !Number.isFinite(v))
    throw new Error("The server returned an invalid number. Please retry.");
  return v;
}
const numberOrNull = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) ? v : null;
const strings = (v: unknown): string[] => list(v).map(str).filter(Boolean);
function label(v: unknown): C.Label {
  const r = obj(v);
  return { code: str(r.code), label: str(r.label) };
}
function place(v: unknown): C.Place | null {
  if (v == null) return null;
  const r = obj(v);
  return typeof r.featureId === "string"
    ? {
        featureId: r.featureId,
        path: typeof r.path === "string" ? r.path : null,
        name: str(r.name),
        kindCode: str(r.kindCode),
        kindLabel: str(r.kindLabel),
      }
    : null;
}
function unit(v: unknown): { featureId: string; name: string; path?: string | null } | null {
  if (v == null) return null;
  const r = obj(v);
  return { featureId: str(r.featureId), name: str(r.name), path: typeof r.path === "string" ? r.path : null };
}
function card(v: unknown): C.InstitutionCard {
  const r = obj(v),
    p = r.parent == null ? null : obj(r.parent);
  return {
    code: str(r.code),
    name: str(r.name),
    kind: label(r.kind),
    arm: r.arm == null ? null : label(r.arm),
    basis: r.basis == null ? null : label(r.basis),
    parent: p ? { code: str(p.code), name: str(p.name) } : null,
    leaders: num(r.leaders),
    children: num(r.children),
    purpose: nullable(r.purpose),
    image: nullable(r.image),
  };
}
export function directory(v: unknown): C.Directory {
  const r = obj(v);
  return {
    total: num(r.total),
    gaps: strings(r.gaps),
    arms: list(r.arms).map((a) => {
      const ar = obj(a);
      return {
        code: str(ar.code),
        label: str(ar.label),
        about: nullable(ar.about),
        count: num(ar.count),
        groups: list(ar.groups).map((g) => {
          const gr = obj(g);
          return {
            kind: label(gr.kind),
            institutions: list(gr.institutions).map(card),
          };
        }),
      };
    }),
  };
}
function legal(v: unknown): C.LegalItem {
  const r = obj(v);
  return {
    effect: str(r.effect),
    designation: str(r.designation),
    heading: nullable(r.heading),
    instrument: str(r.instrument),
    instrumentCode: nullable(r.instrumentCode),
    provisionCode: nullable(r.provisionCode),
    excerpt: str(r.excerpt),
    explanation: nullable(r.explanation),
    reviewStatus: str(r.reviewStatus),
    via: nullable(r.via),
  };
}
function content(v: unknown): C.ContentItem {
  const r = obj(v),
    subject = obj(r.subject);
  return {
    code: str(r.code),
    slug: str(r.slug),
    language: str(r.language),
    title: str(r.title),
    summary: nullable(r.summary),
    category: label(r.category),
    classification: r.classification == null ? null : label(r.classification),
    body: str(r.body),
    image: nullable(r.image),
    tags: strings(r.tags),
    isDevelopmentText: r.isDevelopmentText === true,
    subject: { table: str(subject.table), code: nullable(subject.code) },
    unresolvedMedia: strings(r.unresolvedMedia),
  };
}
export function contentPage(v: unknown): C.ContentPage {
  const r = obj(v);
  return {
    content: r.content == null ? null : content(r.content),
    related: list(r.related).map(content),
    gaps: strings(r.gaps),
  };
}
export function library(v: unknown): C.ContentLibrary {
  const r = obj(v);
  return {
    items: list(r.items).map(content),
    categories: list(r.categories).map((c) => {
      const x = obj(c);
      return { ...label(x), count: num(x.count) };
    }),
    gaps: strings(r.gaps),
  };
}
function relation(v: unknown): C.InstitutionRelation {
  const r = obj(v);
  return {
    code: str(r.code),
    name: str(r.name),
    relation: label(r.relation),
    children: num(r.children),
  };
}
export function institution(v: unknown): C.InstitutionProfile {
  const r = obj(v),
    i = obj(r.institution);
  return {
    institution: {
      ...card(i),
      established: nullable(i.established),
      functions: strings(i.functions),
    },
    leaders: list(r.leaders).map((v) => {
      const h = obj(v);
      return {
        holderId: str(h.holderId),
        leaderSlug: typeof h.leaderSlug === "string" ? h.leaderSlug : null,
        name: str(h.name),
        party: nullable(h.party),
        tier: label(h.tier),
        how: label(h.how),
        unit: unit(h.unit),
        since: nullable(h.since),
        photo: nullable(h.photo),
      };
    }),
    legalBasis: list(r.legalBasis).map(legal),
    content: list(r.content).map(content),
    parents: list(r.parents).map(relation),
    children: list(r.children).map(relation),
    metrics: list(r.metrics).map((m) => {
      const x = obj(m);
      return { label: str(x.label), value: num(x.value) };
    }),
    gaps: strings(r.gaps),
  };
}
export function options(v: unknown): C.TreeOptions {
  const r = obj(v);
  return {
    tabs: list(r.tabs).map((t) => {
      const x = obj(t);
      return {
        ...label(x),
        about: nullable(x.about),
        count: num(x.count),
        includes: strings(x.includes),
      };
    }),
    arms: list(r.arms).map((a) => {
      const x = obj(a);
      return {
        code: str(x.code),
        label: str(x.label),
        institutions: list(x.institutions).map((i) => {
          const b = obj(i);
          return {
            code: str(b.code),
            name: str(b.name),
            leaders: num(b.leaders),
          };
        }),
      };
    }),
    gaps: strings(r.gaps),
  };
}
function node(v: unknown): C.TreeNode {
  const r = obj(v),
    ref = obj(r.refs);
  const refs: C.TreeRefs = {
    table: nullable(ref.table),
    code: nullable(ref.code),
    office: nullable(ref.office),
    tier: nullable(ref.tier),
    appointment: nullable(ref.appointment),
    institution: nullable(ref.institution),
    scheme: nullable(ref.scheme),
  };
  const base: C.NodeBase = {
    id: str(r.id),
    name: str(r.name),
    level: str(r.level),
    refs,
  };
  switch (r.type) {
    case "root":
    case "arm":
      return { ...base, type: r.type };
    case "body":
      return {
        ...base,
        type: "body",
        code: str(r.code),
        purpose: nullable(r.purpose),
        kind: nullable(r.kind),
        arm: nullable(r.arm),
        basis: nullable(r.basis),
        leaders: num(r.leaders),
      };
    case "leader": {
      const b = obj(r.body),
        p = r.performance == null ? null : obj(r.performance);
      return {
        ...base,
        type: "leader",
        holderId: str(r.holderId),
        leaderSlug: typeof r.leaderSlug === "string" ? r.leaderSlug : null,
        party: nullable(r.party),
        photo: nullable(r.photo),
        since: nullable(r.since),
        tier: label(r.tier),
        how: label(r.how),
        unit: unit(r.unit),
        body: { code: str(b.code), name: str(b.name) },
        performance: p
          ? {
              score: num(p.score),
              rank: num(p.rank),
              of: num(p.of),
              samples: num(p.samples),
              text: str(p.text),
              basis: str(p.basis),
            }
          : null,
      };
    }
    default:
      throw new Error("This type of governance node is not supported yet.");
  }
}
export function tree(v: unknown): C.GovernanceTree {
  const r = obj(v),
    t = r.tab == null ? null : obj(r.tab);
  return {
    tab: t ? { ...label(t), about: nullable(t.about) } : null,
    place: place(r.place),
    nodes: list(r.nodes).map(node),
    edges: list(r.edges).map((e) => {
      const x = obj(e);
      return { from: str(x.from), to: str(x.to), kind: str(x.kind) };
    }),
    rail: list(r.rail).map((l) => {
      const x = obj(l);
      return {
        ...label(x),
        about: nullable(x.about),
        count: num(x.count),
        unit: place(x.unit),
      };
    }),
    legend: list(r.legend).map(label),
    gaps: strings(r.gaps),
  };
}
function suggestion(v: unknown): C.CompareSuggestion {
  const r = obj(v);
  return {
    featureId: nullable(r.featureId),
    name: str(r.name),
    distanceKm: numberOrNull(r.distanceKm),
    rank: numberOrNull(r.rank),
    value: numberOrNull(r.value),
  };
}
export function compareOptions(v: unknown): C.CompareOptions {
  const r = obj(v);
  return {
    place: place(r.place),
    nearby: list(r.nearby).map(suggestion),
    top: list(r.top).map(suggestion),
    hierarchy: list(r.hierarchy).map((h) => {
      const x = obj(h);
      return {
        rung: str(x.rung),
        label: str(x.label),
        available: x.available === true,
        unit: place(x.unit),
        message: nullable(x.message),
      };
    }),
    metrics: list(r.metrics).map((m) => {
      const x = obj(m);
      return {
        code: str(x.code),
        title: str(x.title),
        unit: nullable(x.unit),
        describe: str(x.describe),
        higherIsBetter: x.higherIsBetter === true,
      };
    }),
    gaps: strings(r.gaps),
  };
}
export function comparison(v: unknown): C.Comparison {
  const r = obj(v);
  return {
    a: place(r.a),
    b: place(r.b),
    gaps: strings(r.gaps),
    rows: list(r.rows).map((v) => {
      const x = obj(v);
      return {
        code: str(x.code),
        title: str(x.title),
        unit: nullable(x.unit),
        higherIsBetter: x.higherIsBetter === true,
        a: numberOrNull(x.a),
        b: numberOrNull(x.b),
        diffPercent: numberOrNull(x.diffPercent),
      };
    }),
  };
}
export function legalBasis(v: unknown): C.LegalBasis {
  const r = obj(v);
  return { items: list(r.items).map(legal), gaps: strings(r.gaps) };
}

/** Next route segments may retain an encoded slash; decode once before the generated query builder encodes it. */
export function contentSlug(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    throw new Error(
      "This article address is not valid. Return to the knowledge library.",
    );
  }
}
