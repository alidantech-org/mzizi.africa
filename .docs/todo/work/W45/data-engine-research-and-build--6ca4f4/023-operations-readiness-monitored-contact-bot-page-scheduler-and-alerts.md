---
{id: TSK-87CA18DC45D4,name: "Operations readiness: monitored contact, bot page, scheduler and alerts",type: task,status: planned,priority: medium,created_at: 2026-11-02T09:55:57.758Z,updated_at: 2026-11-02T09:55:57.758Z,due_at: 2026-12-04,order: 23552}
---

# Operations readiness: monitored contact, bot page, scheduler and alerts

## Goal
Make the data engine safe to run against real sites. Today the engine refuses live requests because no monitored contact exists, so no real site has been probed and no scheduled run exists.

## Context
The compliance document requires an identifiable user agent with a monitored contact channel, bounded rates, stop conditions and an incident route. The engine already enforces these (MZIZI_USER_AGENT, the gate, stop and quarantine commands) but the human-owned parts are missing: a real contact address, a public bot page describing Mzizi and how to opt out, named owners for the six accountable roles, and a place for alerts. This task needs the project owner; an agent prepares everything else. Read .docs/docs/DATA_INTAKE_PLAN.md, .docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md and .docs/docs/LEGALITY_SAFETY_AND_COMPLIANCE.md first. Work only on develop, record progress in this file and tick items with task check.

## Acceptance checklist
- [ ] Project owner supplies a monitored contact address and publishes a bot page; set MZIZI_USER_AGENT in the deployment configuration.
- [ ] Name the six accountable roles in KENYA_JURISDICTION_DOSSIER.md and create reviewer grants for them.
- [ ] Scheduler for structure runs and legal drift checks (robots, terms) that respects each assessment's frequency, with failure alerts written to website.checks and sent to a channel.
- [ ] Dry-run the expected-site probe for the county pattern against a mock, then against real hosts only after an approved assessment or an explicit decision for reachability probes.
- [ ] Document the runbook and incident drill (mzizi-data stop, quarantine, restore).
