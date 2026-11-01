---
{id: DOC-99896D114989,name: Testing Rules,type: documentation}
---

# Testing Rules

- Choose checks that correspond to changed code and acceptance criteria; report commands and outcomes accurately.
- Contract changes require checks for both producers and consumers, including stable IDs and provenance fields.
- Prefer deterministic fixtures. Keep source text and raw evidence intact; do not use a fixture as proof of live API behavior.
- Exercise success, empty, error, offline, and stale/rapid-request cases for network-driven UI.
- Use existing package scripts. Do not introduce a parallel test framework without a clear need.
- Record any device-only validation and its limitations in the task.
