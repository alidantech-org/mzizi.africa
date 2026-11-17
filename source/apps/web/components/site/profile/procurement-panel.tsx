"use client";

import Link from "next/link";

import { useLanguage } from "#/lib/site/i18n.tsx";
import { routes } from "#/lib/dryv/routes.ts";
import type { ProcurementSummary } from "#/lib/types/procurement-summary.ts";

const money = (amount: number | null | undefined, currency: string | null | undefined): string =>
  amount == null
    ? "—"
    : `${currency ?? ""} ${new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(amount)}`.trim();

export function ProcurementPanel({ summary }: { summary: ProcurementSummary }) {
  const { t } = useLanguage();
  return (
    <div className="rounded-[var(--radius)] border border-border-default bg-surface-elevated p-6 shadow-[var(--shadow)]">
      <div className="grid grid-cols-2 gap-4 border-b border-border-default pb-5">
        <div>
          <p className="font-display text-4xl">{summary.count}</p>
          <p className="text-sm text-content-muted">{t("contracts")}</p>
        </div>
        <div>
          <p className="font-display text-4xl">{money(summary.totalAmount, summary.currency)}</p>
          <p className="text-sm text-content-muted">{t("totalAwarded")}</p>
        </div>
      </div>
      <ul className="divide-y divide-border-default">
        {summary.recent.map((item) => (
          <li
            key={item.procurementId}
            className="flex flex-wrap items-start justify-between gap-3 py-4"
          >
            <div className="min-w-0">
              <p className="font-medium">{item.title}</p>
              <p className="mt-0.5 text-sm text-content-muted">
                {item.awardedTo ? `${t("awardedTo")} ${item.awardedTo}` : t("notRecorded")}
                {item.year ? ` · ${item.year}` : ""}
                {item.status ? ` · ${item.status}` : ""}
              </p>
              {item.evidence[0] ? (
                <Link
                  href={`${routes.evidenceView}?citationId=${item.evidence[0].citationId}`}
                  className="mt-1 inline-block text-sm font-medium text-link hover:underline"
                >
                  {t("seeEvidence")} →
                </Link>
              ) : null}
            </div>
            <p className="font-display text-xl">{money(item.amount, item.currency)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
