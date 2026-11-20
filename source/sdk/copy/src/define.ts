/**
 * Copy declarations. Each leaf states its English and Swahili wording; a missing language is a compile error, so
 * coverage is enforced by the types. `{name}` placeholders become required, typed parameters.
 *
 *   const shell = defineCopy("shell", { search: { open: { en: "Search", sw: "Tafuta" } } });
 *   t(shell.search.open)        // key `app.shell.search.open`
 */
export type Wording = { readonly en: string; readonly sw: string };
export type CopyTree = { readonly [name: string]: Wording | CopyTree };

type ParamNames<S extends string> = S extends `${string}{${infer N}}${infer Rest}` ? N | ParamNames<Rest> : never;
export type CopyParams<W extends Wording> = { [K in ParamNames<W["en"]>]: string | number };

/** What the UI holds for one wording: its database key and the parameters it needs. */
export type CopyKey<W extends Wording = Wording> = { readonly key: string; readonly wording?: W };

export type CopyDescriptors<T extends CopyTree> = {
  readonly [K in keyof T]: T[K] extends Wording ? CopyKey<T[K]> : T[K] extends CopyTree ? CopyDescriptors<T[K]> : never;
};

const isWording = (v: Wording | CopyTree): v is Wording => typeof (v as Wording).en === "string" && typeof (v as Wording).sw === "string";
const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

export const PREFIX = "app";

/** All wordings of a tree, keyed by database code (`app.<area>.<path>`). Used by the seed and the coverage check. */
export function flatten(area: string, tree: CopyTree, path: string[] = []): { key: string; en: string; sw: string }[] {
  return Object.entries(tree).flatMap(([name, node]) =>
    isWording(node)
      ? [{ key: [PREFIX, area, ...path, name].map(kebab).join("."), en: node.en, sw: node.sw }]
      : flatten(area, node, [...path, name]),
  );
}

function build<T extends CopyTree>(area: string, tree: T, path: string[]): CopyDescriptors<T> {
  const out: Record<string, unknown> = {};
  for (const [name, node] of Object.entries(tree)) {
    out[name] = isWording(node)
      ? { key: [PREFIX, area, ...path, name].map(kebab).join(".") }
      : build(area, node, [...path, name]);
  }
  return out as CopyDescriptors<T>;
}

/** Declares an area. The tree is kept so wordings can be listed; the returned object holds the typed keys. */
export function defineCopy<const T extends CopyTree>(area: string, tree: T) {
  return { area, tree, keys: build(area, tree, []) };
}

/** Fills `{name}` placeholders; a missing parameter is left visible so it is noticed, never silently dropped. */
export function fill(text: string, params?: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (whole, name: string) => (params && name in params ? String(params[name]) : whole));
}
