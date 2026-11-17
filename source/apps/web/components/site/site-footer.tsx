"use client";

import Link from "next/link";

import { useLanguage } from "#/lib/site/i18n.tsx";
import { routes } from "#/lib/dryv/routes.ts";

export function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="mt-24 border-t border-border-default bg-surface-sunken/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-xl">Mzizi</p>
          <p className="mt-2 max-w-xs text-sm text-content-muted">{t("footerAbout")}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-content-muted">
            {t("footerData")}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link className="hover:underline" href={routes.placeSearch}>
                {t("navPlaces")}
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href={routes.sourceBrowse}>
                {t("navSources")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-content-muted">
            {t("footerProject")}
          </p>
          <p className="mt-3 text-sm text-content-muted">{t("sampleNotice")}</p>
        </div>
      </div>
    </footer>
  );
}
