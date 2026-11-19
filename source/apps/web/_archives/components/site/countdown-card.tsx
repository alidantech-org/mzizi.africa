import Link from "next/link";

import type { ExperienceCountdown } from "@mzizi/api-client/types/experience/countdown.ts";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const ORDINALS = ["first", "second", "third", "fourth", "fifth"];

/** Says in words how a recurring date is produced, from the rule data, so the reason for the date is visible. */
function ruleText(rule: NonNullable<ExperienceCountdown["rule"]>): string {
  const month = rule.month ? new Date(2000, rule.month - 1, 1).toLocaleString("en", { month: "long" }) : "";
  if (rule.kindCode === "nth-weekday" && rule.weekday && rule.nthWeekday) {
    const every = rule.intervalYears && rule.intervalYears > 1 ? ` every ${ORDINALS[rule.intervalYears - 1] ?? rule.intervalYears} year` : " every year";
    return `The ${ORDINALS[rule.nthWeekday - 1] ?? rule.nthWeekday} ${WEEKDAYS[rule.weekday - 1]} of ${month}${every}.`;
  }
  if (rule.kindCode === "fixed-date" && rule.dayOfMonth) return `Every year on ${rule.dayOfMonth} ${month}.`;
  return "";
}

const formatDay = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString("en", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

/** The days to the next election, how the date is known, why it is that date and the timetable milestones. */
export function CountdownCard({ next, href }: { next: ExperienceCountdown; href: string }) {
  const projected = next.knowledgeCode === "projected";
  return (
    <section className="glass card" aria-labelledby="countdown-title">
      <p className="kicker">{next.name}</p>
      <div className="mt-2 flex flex-wrap items-end gap-x-6 gap-y-2">
        <p className="num font-display text-6xl leading-none" id="countdown-title">{next.daysAway}<span className="ml-2 text-lg font-body text-content-muted">days</span></p>
        <p className="pb-1 text-content-muted">{formatDay(next.plannedOn)}</p>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="chip" data-known={next.knowledgeCode}>{next.knowledgeLabel}</span>
        {next.rule ? <span className="text-content-muted">{ruleText(next.rule)}</span> : null}
      </div>
      {projected ? <p className="mt-2 text-xs text-content-muted">This date is worked out from the rule. It becomes official when the electoral commission announces it.</p> : null}
      {next.milestones.length > 0 ? (
        <ol className="mt-4 grid gap-1.5 text-sm sm:grid-cols-2">
          {next.milestones.map((m) => (
            <li key={m.name} className="flex items-baseline justify-between gap-3 border-b border-[var(--border-default)] pb-1">
              <span>{m.name}</span>
              <span className="num shrink-0 text-xs text-content-muted">{new Date(`${m.plannedOn}T00:00:00`).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}</span>
            </li>
          ))}
        </ol>
      ) : null}
      <Link href={href} className="mt-4 inline-flex text-sm font-semibold text-clay hover:underline">Open the calendar</Link>
    </section>
  );
}
