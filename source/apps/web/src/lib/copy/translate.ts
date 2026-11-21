/** The translator: no hooks and no client marker, so server and client components use the same one. */
import { fill, type CopyKey, type CopyParams, type Wording } from "@mzizi/copy";

export type CopyBundle = { language: string; hash: string; entries: Record<string, string>; missing: string[] };

type WordingOf<K> = K extends CopyKey<infer W> ? W : never;
type Args<W> = W extends Wording ? (keyof CopyParams<W> extends never ? [params?: undefined] : [params: CopyParams<W>]) : never;

/** A key with no wording in this language shows as ⟦key⟧: it is reported, never filled from another language. */
export function translate(bundle: CopyBundle) {
  return <K extends CopyKey>(item: K, ...args: Args<WordingOf<K>>): string => {
    const text = bundle.entries[item.key];
    return text === undefined ? `⟦${item.key}⟧` : fill(text, args[0] as Record<string, string | number> | undefined);
  };
}

