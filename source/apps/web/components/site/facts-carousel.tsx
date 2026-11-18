"use client";

import { useEffect, useRef, useState } from "react";

import { DidYouKnow } from "#/components/site/ui/hint.tsx";
import { useLanguage } from "#/lib/site/i18n.tsx";

export interface Fact { readonly code: string; readonly statement: string; readonly detail?: string | null; readonly place?: string | null }

/**
 * "Did you know?" tips. One fact is a static tip; two or more rotate on their own, pause while the visitor hovers or focuses,
 * stay still for people who prefer reduced motion, and can be moved with the buttons.
 */
export function FactsCarousel({ facts, scopeName }: { facts: readonly Fact[]; scopeName: string }) {
  const { tr } = useLanguage();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const still = useRef(false);
  useEffect(() => {
    still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  useEffect(() => {
    if (facts.length < 2) return;
    const timer = setInterval(() => {
      if (!paused && !still.current) setIndex((value) => (value + 1) % facts.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [facts.length, paused]);
  if (facts.length === 0) return null;
  const fact = facts[index % facts.length]!;
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <DidYouKnow title={tr("Did you know?")}>
        <div aria-live="polite">
          <p className="font-semibold">{fact.statement}</p>
          {fact.detail ? <p className="mt-1 text-content-muted">{fact.detail}</p> : null}
          <p className="mt-1 text-xs text-content-muted">{fact.place ? tr("About {}", fact.place) : tr("About {}", scopeName)}</p>
        </div>
        {facts.length > 1 ? (
          <div className="mt-3 flex items-center gap-2">
            <button type="button" className="btn btn-ghost !h-8 !px-3 !text-xs" onClick={() => setIndex((index - 1 + facts.length) % facts.length)} aria-label={tr("Previous fact")}>‹</button>
            <span className="text-xs text-content-muted num">{(index % facts.length) + 1} / {facts.length}</span>
            <button type="button" className="btn btn-ghost !h-8 !px-3 !text-xs" onClick={() => setIndex((index + 1) % facts.length)} aria-label={tr("Next fact")}>›</button>
          </div>
        ) : null}
      </DidYouKnow>
    </div>
  );
}
