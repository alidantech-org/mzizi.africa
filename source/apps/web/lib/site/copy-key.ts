/**
 * The copy key of an English sentence or heading: the text lowercased, every run of other characters one hyphen; a slug
 * over 60 characters is cut to 50 and ends with the FNV-1a hash of the whole slug. The database rows use the same rule.
 */
function fnv1a(text: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash = Math.imul(hash ^ text.charCodeAt(index), 0x01000193) >>> 0;
  }
  return hash.toString(16);
}

export function phraseKey(english: string): string {
  let slug = english.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (slug.length > 60) slug = `${slug.slice(0, 50).replace(/-+$/g, "")}-${fnv1a(slug)}`;
  return `web.phrase.${slug}`;
}

export const wordKey = (word: string): string => `web.word.${word.toLowerCase()}`;
