# Mzizi agent (proposal, not implemented)

This folder holds only this README. It reserves the place for a future **assistive application for AI and LLMs**: tooling plus the ability to do heavy work (planning, inspection, repair and mapping help) for the rest of the system. The implementation is planned. The agreed direction is in the [developer portal guide](../../../.docs/design/architecture/DEVELOPER_PORTAL.md) and [decision record](../../../.docs/decisions/DEC-DEVELOPER-PORTAL.md).

## Rules

- The agent is a **client of the engine**. It will use the shared typed HTTP operations available to the portal and CLI, with authorized workspace and artifact access.
- Its output is always a **Proposal** stored as an artifact, validated against manifest schemas before anything applies it. Model output is never silent canonical truth; the pilot exports drafts for owner review.
- Its tools are: inspect engine capabilities, catalog and reference data, read authorized artifacts, submit engine and script jobs, and prepare drafts in the shared data workspace. The initial parity check uses the portal and an API client.

## Where it would help

| Hook | Input | Output |
|---|---|---|
| Prepare for work | Engine digest, database digest | A proposed or edited job plan |
| During or after a run | Failed events, sampled scraped pages | Manifest fix proposals |
| Map time | Staged documents, target domain schema | Mapping and normalisation proposals |
| Review | Candidate and evidence | Accept/reject assistance |

The previous `source/packages/agent` library (provider-neutral model interface, tool registry, `Proposal` type) was removed in November 2026 because nothing used it. Define the proposal contract with the first model-assisted operation. The [schema map](../../schema/README.md) describes current contract ownership.
