/** The calendar: dated events for a range with how each date is known, and the countdown to the next general election. */
import type { DataSource } from "typeorm";

import { crumbs, lastWord, shortCode, valueLabel } from "#/modules/insights/features/insights/reads/shared.ts";

const NAME = (lang: string) => `coalesce(
    (select n.name from event.names n join reference.languages l on l.id = n.language_id where n.event_id = e.id and l.iso6391 = ${lang} order by n.is_preferred desc limit 1),
    (select n.name from event.names n where n.event_id = e.id order by n.is_preferred desc limit 1), e.code)`;

export async function calendar(
  db: DataSource,
  input: { from?: string; to?: string; kindCode?: string; featureId?: string; languageCode?: string },
) {
  const lang = input.languageCode ?? "en";
  const today = new Date().toISOString().slice(0, 10);
  const from = input.from ?? today;
  const to = input.to ?? new Date(Date.now() + 366 * 86400000).toISOString().slice(0, 10);
  const place = input.featureId ? (await crumbs(db, input.featureId, lang)).map((c) => c.featureId) : [];
  const rows: Record<string, unknown>[] = await db.query(
    `select o.code as occurrence_code, e.code as event_code, ${NAME("$3")} as name, k.code as kind_code, ${valueLabel("k.id", "$3")} as kind_label,
       o.planned_starts_on::text as planned_on, o.actual_starts_on::text as actual_on,
       st.code as status_code, ${valueLabel("st.id", "$3")} as status_label, kn.code as knowledge_code, ${valueLabel("kn.id", "$3")} as knowledge_label,
       (select ${valueLabel("rs.id", "$3")} from event.changes ch join reference.values rs on rs.id = ch.reason_id where ch.occurrence_id = o.id order by ch.created_at desc limit 1) as change_reason,
       (select ch.explanation from event.changes ch where ch.occurrence_id = o.id order by ch.created_at desc limit 1) as change_note,
       (select count(*) from event.venues v where v.occurrence_id = o.id)::int as venue_count,
       (o.planned_starts_on - current_date)::int as days_away
     from event.occurrences o join event.events e on e.id = o.event_id
     join reference.values k on k.id = e.event_kind_id join reference.values st on st.id = o.status_id join reference.values kn on kn.id = o.knowledge_id
     where o.deleted_at is null and o.planned_starts_on between $1::date and $2::date
       and ($4::text is null or k.code = $4)
       and (cardinality($5::uuid[]) = 0 or e.scope_feature_id is null or e.scope_feature_id = any($5)
            or exists (select 1 from event.venues v where v.occurrence_id = o.id and v.feature_id = any($5)) or not exists (select 1 from event.venues v where v.occurrence_id = o.id))
     order by o.planned_starts_on, name limit 400`,
    [from, to, lang, input.kindCode ?? null, place],
  );
  const gaps: string[] = [];
  if (rows.length === 0) gaps.push("No events are recorded for this range. Official calendars may not be published yet.");
  const next = await countdown(db, lang);
  return {
    from, to, next,
    events: rows.map((r) => ({
      occurrenceCode: shortCode(String(r.occurrence_code)), eventCode: shortCode(String(r.event_code)), name: r.name, kindCode: lastWord(String(r.kind_code)), kindLabel: r.kind_label,
      plannedOn: r.planned_on, actualOn: r.actual_on, statusCode: lastWord(String(r.status_code)), statusLabel: r.status_label,
      knowledgeCode: lastWord(String(r.knowledge_code)), knowledgeLabel: r.knowledge_label, changeReason: r.change_reason, changeNote: r.change_note,
      venueCount: Number(r.venue_count), daysAway: Number(r.days_away),
    })),
    gaps,
  };
}

async function countdown(db: DataSource, lang: string) {
  const next: Record<string, unknown>[] = await db.query(
    `select o.id, e.id as event_id, e.code as event_code, ${NAME("$1")} as name, o.planned_starts_on::text as planned_on,
       (o.planned_starts_on - current_date)::int as days_away, kn.code as knowledge_code, ${valueLabel("kn.id", "$1")} as knowledge_label
     from event.occurrences o join event.events e on e.id = o.event_id join reference.values k on k.id = e.event_kind_id and k.code = 'ref.val.evt.event.kind.general-election'
     join reference.values kn on kn.id = o.knowledge_id
     where o.deleted_at is null and o.planned_starts_on >= current_date order by o.planned_starts_on limit 1`,
    [lang],
  );
  const n = next[0];
  if (!n) return null;
  const rules: Record<string, unknown>[] = await db.query(
    `select rk.code as kind_code, r.month, r.day_of_month, r.weekday, r.nth_weekday, r.interval_years, r.rrule
       from event.rules r join reference.values rk on rk.id = r.rule_kind_id where r.event_id = $1 and r.deleted_at is null limit 1`,
    [n.event_id],
  );
  const milestones: Record<string, unknown>[] = await db.query(
    `select ${NAME("$2")} as name, o.planned_starts_on::text as planned_on, (o.planned_starts_on - current_date)::int as days_away, i.offset_days
       from event.schedules s join event.items i on i.schedule_id = s.id join event.events e on e.id = i.event_id
       join event.occurrences o on o.id = i.occurrence_id
      where s.anchor_event_id = $1 and s.deleted_at is null order by i.position`,
    [n.event_id, lang],
  );
  const rule = rules[0];
  return {
    eventCode: shortCode(String(n.event_code)), name: n.name, plannedOn: n.planned_on, daysAway: Number(n.days_away),
    knowledgeCode: lastWord(String(n.knowledge_code)), knowledgeLabel: n.knowledge_label,
    rule: rule ? {
      kindCode: lastWord(String(rule.kind_code)), month: rule.month, dayOfMonth: rule.day_of_month, weekday: rule.weekday,
      nthWeekday: rule.nth_weekday, intervalYears: rule.interval_years, rrule: rule.rrule,
    } : null,
    milestones: milestones.map((m) => ({ name: m.name, plannedOn: m.planned_on, daysAway: Number(m.days_away), offsetDays: m.offset_days })),
  };
}
