/**
 * What affects a place. A national record does not automatically affect every place: its scope decides.
 * Relationships are kept apart (representation, authority) instead of one generic "reports to".
 */
import { flat, tree, type Office } from "#/data/government";
import type { OkPlace } from "#/views/types";

export type Scope = "national" | "county" | "constituency" | "ward";
export type Applied = { office: Office; scope: Scope; scopeName: string; relation: "Representation" | "Authority" };

const scopeOf = (o: Office): Scope => (o.id === "mps" ? "constituency" : o.id === "mca" || o.id === "ward-admin" || o.level === "Ward" ? "ward" : o.level === "County" || /governor|county|senators|women-reps/.test(o.id) ? "county" : "national");

export function officesFor(place: OkPlace): Applied[] {
  const names: Record<Scope, string | undefined> = { national: place.countryName, county: place.county?.name, constituency: place.constituency?.name, ward: place.ward?.name };
  return Object.values(tree).flatMap((l) => flat(l)).filter((o) => o.role).flatMap((o) => {
    const scope = scopeOf(o);
    const name = names[scope];
    if (!name) return []; // outside this place: not shown
    return [{ office: o, scope, scopeName: name, relation: (scope === "national" ? "Authority" : "Representation") as Applied["relation"] }];
  });
}
