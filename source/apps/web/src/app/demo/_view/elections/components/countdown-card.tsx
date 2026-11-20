/** Countdown card with the rule text and the stages as projections, not confirmed dates. */
import { ElectionCountdown } from "#demo/_view/elections/components/countdown";

export function Countdown() {
  const stages = ["Voter registration", "Candidate nominations", "Campaign period", "Election day"];
  return (
    <div>
      <ElectionCountdown />
      <ul className="mt-5 divide-y divide-line text-sm">
        {stages.map((s) => (
          <li key={s} className="flex justify-between py-2.5">
            <span>{s}</span>
            <span className="text-muted">Projected</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">
        Dates follow the constitutional rule. Official dates are confirmed by the electoral commission.
      </p>
    </div>
  );
}
