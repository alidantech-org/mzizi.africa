"use client";
/** Registers the service worker (production only) and exposes the browser's install prompt. */
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };
let deferred: InstallEvent | null = null;
const listeners = new Set<() => void>();

export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator)
      void (async () => {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          const script = registration.active?.scriptURL ?? registration.waiting?.scriptURL;
          if (script && new URL(script).pathname === "/sw.js" && registration.scope === `${location.origin}/`)
            await registration.unregister();
        }
        await navigator.serviceWorker.register("/demo/sw.js", { scope: "/demo" });
      })().catch(() => {});
    const onPrompt = (e: Event) => {
      e.preventDefault();
      deferred = e as InstallEvent;
      listeners.forEach((l) => l());
    };
    const onInstalled = () => {
      deferred = null;
      listeners.forEach((l) => l());
    };
    addEventListener("beforeinstallprompt", onPrompt);
    addEventListener("appinstalled", onInstalled);
    return () => {
      removeEventListener("beforeinstallprompt", onPrompt);
      removeEventListener("appinstalled", onInstalled);
    };
  }, []);
  return null;
}

/** Install button for the settings menu. Shows nothing when already installed. On iOS it explains the manual step. */
export function InstallApp() {
  const [, force] = useState(0);
  const [standalone, setStandalone] = useState(false);
  const [ios, setIos] = useState(false);
  useEffect(() => {
    const tick = () => force((n) => n + 1);
    listeners.add(tick);
    setStandalone(
      matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true,
    );
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    return () => {
      listeners.delete(tick);
    };
  }, []);
  if (standalone) return null;
  if (deferred)
    return (
      <button
        onClick={async () => {
          await deferred!.prompt();
          await deferred!.userChoice;
          deferred = null;
          force((n) => n + 1);
        }}
        className="flex w-full items-center gap-2 rounded-md border border-line px-2.5 py-1.5 text-sm hover:bg-accent-soft"
      >
        <Download size={15} />
        Install Mzizi as an app
      </button>
    );
  if (ios) return <p className="text-xs text-muted">To install: tap Share, then Add to Home Screen.</p>;
  return null;
}
