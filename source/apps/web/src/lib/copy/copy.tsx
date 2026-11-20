"use client";
/** Interface wording delivered by the backend for the effective language. `t(copy.area.path, params)`; no wording lives in components. */
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { fill, type CopyKey, type CopyParams, type Wording } from "@mzizi/copy";

export type CopyBundle = { language: string; hash: string; entries: Record<string, string>; missing: string[] };

const Ctx = createContext<CopyBundle>({ language: "en", hash: "", entries: {}, missing: [] });

export function CopyProvider({ bundle, children }: { bundle: CopyBundle; children: ReactNode }) {
  return <Ctx.Provider value={bundle}>{children}</Ctx.Provider>;
}

type WordingOf<K> = K extends CopyKey<infer W> ? W : never;
type Args<W> = W extends Wording ? (keyof CopyParams<W> extends never ? [params?: undefined] : [params: CopyParams<W>]) : never;

/** A key with no wording in this language shows as ⟦key⟧: it is reported, never filled from another language. */
export function translate(bundle: CopyBundle) {
  return <K extends CopyKey>(item: K, ...args: Args<WordingOf<K>>): string => {
    const text = bundle.entries[item.key];
    return text === undefined ? `⟦${item.key}⟧` : fill(text, args[0] as Record<string, string | number> | undefined);
  };
}

export function useCopy() {
  const bundle = useContext(Ctx);
  return useMemo(() => translate(bundle), [bundle]);
}

export const useLanguage = () => useContext(Ctx).language;
