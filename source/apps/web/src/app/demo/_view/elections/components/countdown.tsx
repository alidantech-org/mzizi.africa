"use client";
/** Days to the next General Election. Article 101: second Tuesday of August in every fifth year. Computed in the browser. */
import { useEffect, useState } from "react";

function secondTuesdayOfAugust(year: number) {
  const first = new Date(Date.UTC(year, 7, 1)).getUTCDay();
  return new Date(Date.UTC(year, 7, 1 + ((9 - first) % 7) + 7));
}

export function ElectionCountdown() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);
  let year = 2027;
  while (now && secondTuesdayOfAugust(year).getTime() < now.getTime()) year += 5;
  const date = secondTuesdayOfAugust(year);
  const days = now ? Math.ceil((date.getTime() - now.getTime()) / 86400000) : null;
  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="font-display text-7xl tracking-tight">{days ?? "—"}</span>
        <span className="text-lg">days to the General Election</span>
      </div>
      <p className="mt-2 text-sm text-muted">
        {date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })} ·
        second Tuesday of August (Article 101)
      </p>
    </div>
  );
}
