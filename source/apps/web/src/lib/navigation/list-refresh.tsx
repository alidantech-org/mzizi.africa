"use client";
/**
 * The shared layout holds the place lists (country list, search results, one level at a time), and the router does not
 * render a layout again when only the query changes. After the address has changed, this asks the server for fresh lists.
 */
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const KEYS = ["find", "lvl", "pg", "lang"];

export function ListRefresh() {
  const router = useRouter();
  const sp = useSearchParams();
  const key = KEYS.map((k) => `${k}=${sp.get(k) ?? ""}`).join("&");
  const last = useRef(key);
  useEffect(() => {
    if (last.current === key) return;
    last.current = key;
    router.refresh();
  }, [key, router]);
  return null;
}
