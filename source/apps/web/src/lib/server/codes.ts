/**
 * Addresses and row codes (`.docs/rules/codes.md`). The web address of a place is its feature code without the space
 * and table: `/ke/nairobi/westlands` is `geo.ftr.ke.nairobi.westlands`. Countries are `ref.cty.<iso>` and languages
 * `ref.lng.<tag>`. These are the only conversions; screens never build codes themselves.
 */
const COUNTRY = "ref.cty.";
const FEATURE = "geo.ftr.";
const LANGUAGE = "ref.lng.";

export type PlaceAddress = { country: string; trail: string[] };

export const countryCode = (country: string): string => `${COUNTRY}${country.toLowerCase()}`;
export const placeCode = (a: PlaceAddress): string => [`${FEATURE}${a.country.toLowerCase()}`, ...a.trail.map((s) => s.toLowerCase())].join(".");
export const languageCode = (tag: string): string => (tag.startsWith(LANGUAGE) ? tag : `${LANGUAGE}${tag.toLowerCase()}`);
export const languageTag = (code: string): string => (code.startsWith(LANGUAGE) ? code.slice(LANGUAGE.length) : code);
export const countryOf = (code: string): string => (code.startsWith(COUNTRY) ? code.slice(COUNTRY.length) : code);

/** The web address of a place or country code. */
export function hrefOf(code: string): string {
  if (code.startsWith(COUNTRY)) return `/${code.slice(COUNTRY.length)}`;
  if (code.startsWith(FEATURE)) return `/${code.slice(FEATURE.length).split(".").join("/")}`;
  return "/";
}
