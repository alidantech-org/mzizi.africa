"use client";

/** A like with its count, kept by the server for this device, and the beacon that counts a view once a day. Views are never shown. */
import { useEffect, useState, useTransition } from "react";

import { noteView, setLike, type Engagement } from "#/app/interactions.ts";
import { Icon } from "#/components/brand/icon.tsx";
import { useLanguage } from "#/lib/site/i18n.tsx";

export function ReactionControl({ table, subject, initial }: { table: string; subject: string; initial: Engagement }) {
  const { tr } = useLanguage();
  const [state, setState] = useState<Engagement>(initial);
  const [pending, start] = useTransition();
  const liked = state?.liked ?? false;
  const toggle = () => start(async () => setState(await setLike(table, subject, !liked)));
  const label = liked ? tr("Remove your like") : tr("Like this");
  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={liked}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm transition ${liked ? "border-clay bg-clay/15 text-clay" : "border-[var(--border-default)] text-content-muted hover:border-clay hover:text-clay"}`}
    >
      <Icon name="heart" size={18} className={liked ? "fill-current" : ""} />
      <span className="num">{state?.likes ?? "–"}</span>
    </button>
  );
}

export function ViewBeacon({ table, subject }: { table: string; subject: string }) {
  useEffect(() => {
    void noteView(table, subject).catch(() => undefined);
  }, [table, subject]);
  return null;
}
