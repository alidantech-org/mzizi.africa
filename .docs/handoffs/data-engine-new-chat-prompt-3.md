---
{id: HANDOFF-DATA-ENGINE-PROMPT-3,name: Paste prompt for the next data engine chat,type: handoff,tags: [data-engine,handoff]}
---

# Paste prompt

You are continuing the Mzizi Africa repository (main checkout `/home/alidante/Projects/research/alidantech-org/mzizi-africa/mzizi.africa`, branch `develop`; never create branches or worktrees, never push, do not touch `.github`). Read, in order: `AGENTS.md`, `.docs/handoffs/data-engine-handoff-3.md` (it holds the rules the product owner set, the state, commands, traps and the order of work), the newest sections of `.docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md`, `.docs/decisions/auto-approval.md` and `.docs/decisions/entity-matching.md`. Every unit of work goes through the Task CLI: `task list`, then `task show` for the task you start; run `task validate` after `.docs` changes and keep checklists true.

Do not re-ask what the handoff already records. Start by checking whether the procurement promotion pass (`scripts/pipeline/fix3.sh`) finished and finishing it, then do the domain model and the candidate-domain backfill (the product owner's open complaint: 481 sites but only 15 domain rows; every candidate hostname needs a domain row with status, source and reason, plus a TLD zone registry and DNS snapshots), then the ORPP, party, IEBC, Wikimedia and statistics groups in the order the handoff gives. Work autonomously; ask the product owner only when a decision is genuinely theirs.

Dryv does run on this machine. Before touching `dryv/contracts` or the generated API, read `.docs/guidance/running-dryv.md`: start the engine API on port 8750, generate, then hand-add any missing methods to the project-owned `*.service.impl.ts` until `tsc` is clean. Never conclude "Dryv cannot run" without starting the engine API first.

Geography fix: `geo-fix-containment` has been applied to `mzizi` (7 wards reparented, 54 boundaries clipped and promoted). 36 wards still have no boundary; see the status document (3 November) and TSK-8D70F7C0C53E. Wave 2 belongs to the next chat.
