"use client";
/** Interface wording delivered by the backend for the effective language. `t(copy.area.path, params)`; no wording lives in components. */
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { translate, type CopyBundle } from "#/lib/copy/translate";

const Ctx = createContext<CopyBundle>({ language: "en", hash: "", entries: {}, missing: [] });

export type { CopyBundle };

export function CopyProvider({ bundle, children }: { bundle: CopyBundle; children: ReactNode }) {
  return <Ctx.Provider value={bundle}>{children}</Ctx.Provider>;
}

export function useCopy() {
  const bundle = useContext(Ctx);
  return useMemo(() => translate(bundle), [bundle]);
}

export const useLanguage = () => useContext(Ctx).language;
