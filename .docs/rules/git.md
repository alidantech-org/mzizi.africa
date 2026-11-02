---
{id: DOC-0EEB6AFCDE9E,name: Git and Review Rules,type: documentation}
---

# Git and Review Rules

- Stay on the branch requested by the user; do not create branches unless asked.
- Do not add or modify `.github/**` unless explicitly requested.
- Check `git status` before editing and preserve unrelated user changes.
- Keep changes focused, review diffs, and avoid committing generated files, build output, local databases, virtual environments, and dependency directories.
- Update the relevant `.docs` file when architecture, domain ownership, purpose, or data lifecycle changes.
- Report checks that were run and any blocked checks. Do not claim deployment or publication unless it occurred.
