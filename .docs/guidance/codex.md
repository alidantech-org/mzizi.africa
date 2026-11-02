---
{id: DOC-18BC8E8DC4E8,name: Codex Guidance,type: documentation}
---

# Codex Guidance

0. Work only on `develop`; never create branches or worktrees. Track all work through the Task CLI (mandatory; see `.docs/rules/branching-and-task-usage.md`).
1. Read root `AGENTS.md`. For architecture/domain work, read the six required `.docs` documents it names before editing.
2. Use Task to inspect and update planned work: `task list`, `task show <id>`, and the groups under `.docs/todo/`. Keep status and dependencies truthful.
3. Before implementation, inspect the actual files and package scripts. Distinguish current code from target architecture documentation.
4. Preserve unrelated work in the shared working tree. Do not overwrite user edits or secret files.
5. Follow evidence-first rules: canonical IDs, provenance, valid time, uncertainty, reviewable AI output, and verified-only geography.
6. Finish the authorized work, inspect the diff, and record exact verification results. Do not run checks that mutate external state without authorization.
