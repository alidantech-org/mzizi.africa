# Mzizi agent (proposal, not implemented)

This folder holds only this README. It reserves the place for a future **assistive application for AI and LLMs**: tooling plus the ability to do heavy work (planning, inspection, repair and mapping help) for the rest of the system. No code, service or package exists yet, and nothing here is approved scope. The design is in [`.docs/design/architecture/ENGINE_JOB_MODEL.md`](../../../.docs/design/architecture/ENGINE_JOB_MODEL.md) and the decision is [DEC-ENGINE-JOB-MODEL-20261113](../../../.docs/decisions/DEC-ENGINE-JOB-MODEL-20261113.md).

## Rules

- The agent is a **client of the engine**. It uses the same API as the web and CLI and has no special database or storage access.
- Its output is always a **Proposal** stored as an artifact, validated against manifest schemas before anything applies it. Model output is never silent canonical truth; approval follows the existing AI-or-human rule.
- Its tools are: read engine and database digests, read artifacts and staged documents, submit engine jobs, and use a namespaced scratch area in the staging store.

## Where it would help

| Hook | Input | Output |
|---|---|---|
| Prepare for work | Engine digest, database digest | A proposed or edited job plan |
| During or after a run | Failed events, sampled scraped pages | Manifest fix proposals |
| Map time | Staged documents, target domain schema | Mapping and normalisation proposals |
| Review | Candidate and evidence | Accept/reject assistance |

The previous `source/packages/agent` library (provider-neutral model interface, tool registry, `Proposal` type) was removed in November 2026 because nothing used it. The `Proposal` shape belongs in `source/schema/contracts` when the first model-assisted step exists.
