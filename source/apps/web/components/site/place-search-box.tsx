"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { useLanguage } from "#/lib/site/i18n.tsx";
import { routes } from "#/lib/dryv/routes.ts";

/** A name search that opens the results page. */
export function PlaceSearchBox({ initial = "" }: { initial?: string }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [text, setText] = useState(initial);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (text.trim().length >= 2)
      router.push(`${routes.placeSearch}?q=${encodeURIComponent(text.trim())}`);
  };
  return (
    <form onSubmit={submit} className="flex w-full gap-2">
      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchPlaceholder")}
        className="min-w-0 flex-1 rounded-full border border-border-default bg-surface-elevated px-5 py-3 text-base shadow-[var(--shadow)] outline-none focus:border-clay"
      />
      <button
        type="submit"
        className="rounded-full bg-content-primary px-6 py-3 text-sm font-semibold text-content-inverse hover:opacity-90"
      >
        {t("search")}
      </button>
    </form>
  );
}
