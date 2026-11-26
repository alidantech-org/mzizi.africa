/**
 * Link helpers shared by every PostgreSQL schema (FOUNDATION_REDESIGN sections 3, 15, 18 and 21).
 *
 * Contract authors: these helpers only build ordinary Dryv fields, rules and storage constraints. Their descriptions
 * become SQL comments, so a database reader sees the same rule the contract author wrote.
 */
import * as dryv from "@dryvcode/author";
import { shared, sharedProperties } from "#/schemas/_shared.ts";

export const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

/**
 * `identity.identities` and `vocabulary.terms` register themselves here when their files load. Helpers resolve them
 * lazily, so this file imports no schema file and no schema file depends on import order.
 */
type LinkTarget = dryv.RelationTarget & { ref(): dryv.DeclarationRef<"schema"> };
const targets: { identities?: LinkTarget; terms?: LinkTarget } = {};
export function registerLinkTargets(value: { identities?: LinkTarget; terms?: LinkTarget }): void {
  Object.assign(targets, value);
}
function resolve(name: "identities" | "terms"): LinkTarget {
  const target = targets[name];
  if (target === undefined) throw new TypeError(`link target ${name} is not loaded; import its schema file`);
  return target;
}
const Terms = (): LinkTarget => resolve("terms");
const Identities = (): LinkTarget => resolve("identities");

/**
 * The fixed kinds of named thing (section 18). A kind changes only with a migration, because the identity partitions
 * and the kind checks of identity-backed tables depend on it. Organisations (institutions, parties, publishers) share
 * their `entity` identity; facilities share their feature's identity; a country's feature shares the country identity.
 */
export const identityProperties = shared.properties({
  IdentityKind: dryv.property.enum({
    Country: "country",
    Language: "language",
    Currency: "currency",
    Unit: "unit",
    Timezone: "timezone",
    Hierarchy: "hierarchy",
    Level: "level",
    App: "app",
    Feature: "feature",
    Entity: "entity",
    Individual: "individual",
    Position: "position",
    Office: "office",
    Function: "function",
    Procedure: "procedure",
    Coalition: "coalition",
    Instrument: "instrument",
    Bill: "bill",
    Election: "election",
    Event: "event",
    Occurrence: "occurrence",
    Era: "era",
    Indicator: "indicator",
    Metric: "metric",
    Collection: "collection",
    Product: "product",
    Service: "service",
    Project: "project",
    Procurement: "procurement",
    Fund: "fund",
    Debt: "debt",
    Pattern: "pattern",
    Template: "template",
  }),
});

export type IdentityKindValue =
  | "country"
  | "language"
  | "currency"
  | "unit"
  | "timezone"
  | "hierarchy"
  | "level"
  | "app"
  | "feature"
  | "entity"
  | "individual"
  | "position"
  | "office"
  | "function"
  | "procedure"
  | "coalition"
  | "instrument"
  | "bill"
  | "election"
  | "event"
  | "occurrence"
  | "era"
  | "indicator"
  | "metric"
  | "collection"
  | "product"
  | "service"
  | "project"
  | "procurement"
  | "fund"
  | "debt"
  | "pattern"
  | "template";

/**
 * A column that points at a vocabulary term (section 15): a uuid foreign key to `vocabulary.terms.id` whose scheme is
 * named in its description and checked by Mzizi's own database code (the `scheme:` tag drives the generated check).
 * `scheme` is the scheme's path (`geo.feature.kind`); the stored scheme code is `voc.sch.<path>`.
 */
export function term(scheme: string, meaning?: string) {
  return belongsTo(Terms)
    .tags(`scheme:voc.sch.${scheme}`)
    .description(`${meaning === undefined ? "" : `${meaning} `}Term from vocabulary scheme \`${scheme}\`.`);
}

/** A link to any named thing: `identity.identities.id`. */
export function identity(meaning: string) {
  return belongsTo(Identities).description(meaning);
}

/**
 * The kind column of an identity-backed table: the row's `id` is also an `identity.identities.id`, and the pair
 * `(id, identity_kind)` is a composite foreign key, so a feature can never point at a person's identity.
 */
export function identityKindField(kind: IdentityKindValue) {
  return dryv
    .field(identityProperties.IdentityKind)
    .default(kind)
    .description(
      "Kind of the identity this row extends; with `id` it is a composite foreign key to `identity.identities (id, kind)`.",
    );
}

/** Storage constraint name and target for an identity-backed table. */
export const identityReference = {
  fields: ["id", "identityKind"] as const,
  target: Identities,
  targetFields: ["id", "kind"],
};

/** Hash partitioning by country (section 18): sixteen partitions, so reads for one country prune to one partition. */
export function byCountry(table: string) {
  return {
    strategy: "hash" as const,
    keys: ["countryId"] as const,
    partitions: Array.from({ length: 16 }, (_, remainder) => ({
      name: `${table}_h${String(remainder).padStart(2, "0")}`,
      bound: { kind: "hash" as const, modulus: 16, remainder },
    })),
  };
}

/** Monthly RANGE partitioning on a timestamp column, with a default partition for anything outside the series. */
export function byMonth<const K extends string>(table: string, key: K) {
  return {
    strategy: "range" as const,
    keys: [key] as const,
    partitions: [{ name: `${table}_other`, bound: { kind: "default" as const } }],
    series: { start: "2024-01-01", end: "2028-01-01", unit: "month" as const, name: `${table}_{year}_{month}` },
  };
}
