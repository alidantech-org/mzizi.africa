"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Icon } from "#/components/brand/icon.tsx";
import { useLanguage } from "#/lib/site/i18n.tsx";
import { routes } from "#/lib/dryv/routes.ts";

/** A name search that opens the results page. */
export function PlaceSearchBox({ initial = "" }: { initial?: string }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [text, setText] = useState(initial);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (text.trim().length >= 2) router.push(`${routes.placeSearch}?q=${encodeURIComponent(text.trim())}`);
  };
  return (
    <form onSubmit={submit} role="search" className="glass flex w-full items-center gap-2 rounded-full p-1.5 pl-5">
      <Icon name="search" size={20} className="shrink-0 text-content-muted" />
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder={t("searchPlaceholder")} aria-label={t("searchPlaceholder")} className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-content-muted" />
      <button type="submit" className="btn btn-primary !px-5">{t("search")}</button>
    </form>
  );
}
