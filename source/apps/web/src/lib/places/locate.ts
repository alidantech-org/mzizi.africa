"use client";
/** Finds the place under the reader's device through the generated resolve operation. Only after the browser's own permission prompt; coordinates are sent as a POST body and never put in an address. */
import { explorerResolveExplorerCoordinates } from "@mzizi/api-client/actions/explorer";

export type LocateResult =
  | { status: "found"; href: string; name: string; countryCode: string }
  | { status: "outside" | "several" | "denied" };

export function locate(options: { countryCode?: string; languageCode: string }): Promise<LocateResult> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return resolve({ status: "denied" });
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const res = await explorerResolveExplorerCoordinates({
          body: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracyMeters: pos.coords.accuracy,
            countryCode: options.countryCode ? options.countryCode.toUpperCase() : undefined,
            languageCode: options.languageCode,
          },
        });
        const body = res.body;
        if (!res.success || !body || body.status === "unresolved" || !body.candidates.length) return resolve({ status: "outside" });
        if (body.status === "ambiguous") return resolve({ status: "several" });
        const best = body.candidates[0];
        resolve({ status: "found", href: best.canonicalPath, name: best.name, countryCode: best.countryCode.toLowerCase() });
      },
      () => resolve({ status: "denied" }),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  });
}
