"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useLanguage } from "#/_archives/lib/site/i18n";
import { placeAtPosition } from "#/_archives/app/actions";

/** Reads the browser's position (only when pressed) and opens the profile of the place there. */
export function LocateButton() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [state, setState] = useState<"idle" | "locating" | "denied">("idle");
  const locate = () => {
    if (!("geolocation" in navigator)) {
      setState("denied");
      return;
    }
    setState("locating");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        void placeAtPosition(latitude, longitude, language).then((path) =>
          path ? router.push(`/${path}`) : setState("denied"),
        );
      },
      () => setState("denied"),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    );
  };
  return (
    <div>
      <button
        type="button"
        onClick={locate}
        disabled={state === "locating"}
        className="inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3.5 text-base font-semibold text-cream shadow-[var(--shadow-lift)] transition hover:brightness-110 disabled:opacity-70"
      >
        <span aria-hidden>◎</span>
        {state === "locating" ? t("locating") : t("useLocation")}
      </button>
      {state === "denied" ? (
        <p role="status" className="mt-3 text-sm text-content-muted">
          {t("locationDenied")}
        </p>
      ) : null}
    </div>
  );
}
