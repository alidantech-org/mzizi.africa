/**
 * Schema: accountability | Database: mzizi (read-only analytical surface; no persisted tables).
 * Derived indicators are projections over Finance, Civic, Politics, Governance and Source evidence.
 * Persisting programme, contribution, review or commitment facts here would duplicate domain ownership.
 * Query/aggregate execution is not implemented by Dryv's current database application.
 */
import * as dryv from "@dryvcode/author";

export const accountability = dryv
  .group({ name: "accountability" })
  .description("Read-only derived accountability indicators; intentionally contains no storage schemas.");
export const accountabilityViews = [
  "budget_execution",
  "procurement_performance",
  "project_performance",
  "service_coverage",
  "institutional_performance",
  "promise_progress",
  "oversight_signals",
] as const;
