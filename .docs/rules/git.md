---
{id: DOC-0EEB6AFCDE9E,name: Git and Review Rules,type: documentation}
---

# Git and Review Rules

- Work only on `develop`. Never create branches or worktrees. Full rules: `branching-and-task-usage.md`.
- Do not add or modify `.github/**` unless explicitly requested.
- Check `git status` before editing and preserve unrelated user changes.
- Keep changes focused, review diffs, and avoid committing generated files, build output, local databases, virtual environments, and dependency directories.
- Update the relevant `.docs` file when architecture, domain ownership, purpose, or data lifecycle changes.
- Report checks that were run and any blocked checks. Do not claim deployment or publication unless it occurred.
