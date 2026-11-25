"use client";
/**
 * Finds the place under the reader's device through the generated point lookup, only after the browser's own permission
 * prompt. This is a genuine interaction, so it is the one client-side read.
 */
import { geographyFindPlacesAtPoint } from "@mzizi/api-client/actions/geography";

export type LocateResult =
  | { status: "found"; href: string; name: string; countryCode: string }
  | { status: "outside" | "several" | "denied" };

/** `geo.ftr.ke.nairobi.westlands` → `/ke/nairobi/westlands` (the web address rule in `#/lib/server/codes`). */
const FEATURE = "geo.ftr.";

export function locate(_options: { countryCode?: string; languageCode: string }): Promise<LocateResult> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return resolve({ status: "denied" });
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const res = await geographyFindPlacesAtPoint({ query: { latitude: pos.coords.latitude, longitude: pos.coords.longitude } });
        const best = res.success ? res.body?.places[0] : undefined;
        if (!best || !best.code.startsWith(FEATURE)) return resolve({ status: "outside" });
        const segments = best.code.slice(FEATURE.length).split(".");
        resolve({
          status: "found",
          href: `/${segments.join("/")}`,
          name: best.names.find((n) => n.isDefault)?.text ?? segments.at(-1) ?? best.code,
          countryCode: segments[0] ?? "",
        });
      },
      () => resolve({ status: "denied" }),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  });
}
