"use client";

import { useEffect, useState } from "react";

export type Loaded<T> =
  | { readonly state: "loading" }
  | { readonly state: "ready"; readonly value: T }
  | { readonly state: "failed"; readonly message: string };

/** Runs an async read whenever `key` changes and reports loading, the value, or the failure message. */
export function useAsync<T>(read: () => Promise<T>, key: string): Loaded<T> {
  const [result, setResult] = useState<Loaded<T>>({ state: "loading" });
  useEffect(() => {
    let current = true;
    setResult({ state: "loading" });
    read().then(
      (value) => current && setResult({ state: "ready", value }),
      (error: unknown) =>
        current &&
        setResult({
          state: "failed",
          message: error instanceof Error ? error.message : String(error),
        }),
    );
    return () => {
      current = false;
    };
    // `read` is recreated every render; `key` says when the inputs really changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return result;
}
