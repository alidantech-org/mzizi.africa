import type { Ctx } from "#/lib/route";
import type { Resolved } from "#/data/places";

export type OkPlace = Extract<Resolved, { ok: true }>;
export type ViewProps = { ctx: Ctx; place: OkPlace; /** Effective language: ?lang=, else the cookie, else English. */ lang: string };

/** Name of the place for headings: the most specific level, or the country. */
export const placeName = (p: OkPlace) => p.trail.at(-1)?.name ?? p.countryName;
