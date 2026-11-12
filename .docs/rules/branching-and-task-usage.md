---
{id: RULE-BRANCHING-TASK-USAGE,name: Branching and mandatory Task usage,type: rule,tags: [git,task,agent-guidance]}
---

# Branching and mandatory Task usage

These rules bind every coding agent and contributor. They override any convenience default of an agent tool.

## Branch rule: `develop` only

- Work **only on the `develop` branch, directly in the main checkout**. Check with `git branch --show-current` before editing.
- **Never invent branches.** Do not run `git checkout -b`, `git switch -c`, `git branch <name>`, or let a tool create a feature, fix or agent branch.
- **Never create worktrees.** Do not run `git worktree add` or start a tool mode that makes an isolated worktree.
- If the checkout is not on `develop` or a worktree was imposed by the environment, stop and ask the user instead of working around it.
- Do not push to or merge into `main` unless the user explicitly asks.
- Do not add or modify `.github/**` unless explicitly requested.

## Task rule: every piece of work goes through the Task CLI

Task (`task`, `taskcode`, `tc`) is the only source of truth for planned and finished work. Not using it is a failure of the work, not a style choice.

1. **Before starting**: run `task list` and `task show <id>`. Pick the matching task or create one with `task create --title "…" --group <id> --body-file task.md`. Read `.docs/rules/task-writing.md` first.
2. **While working**: `task start <id>` (or `task update <id> --status in-progress`), tick progress with `task check <id> --item N`, and record findings under `## Progress` or `## Notes` in the same task file.
3. **Decisions and handoffs**: write them as Markdown in `.docs/decisions/` and `.docs/handoffs/`, not only in chat.
4. **Finishing**: tick every acceptance item truthfully, set the task to `completed` only when the criteria are met (`blocked` with a concrete reason otherwise), and run `task validate`.
5. **Never** hand-edit `id`, `status_history` or other managed frontmatter. Never keep a parallel TODO list or weaken the `task.yaml` quality policy.
6. Use `--json` when scripting. Use `task archive`, not `task delete`, for work that should be kept.

## Documentation upkeep

When a change alters architecture, paths, ownership or process, update the affected core document in `.docs/docs/` or the relevant grouped guide in `.docs/design/` in the same work and run `task validate`. Stale paths are defects: all code lives under `source/` (`source/apps/*`, `source/backend/*`).

## Agent and contributor workflow

- Read `AGENTS.md` and the relevant core and design documents before changing system behavior. Confirm claims against active code and contracts; label proposals and archived implementations accurately.
- Inspect the working tree before editing and preserve unrelated user changes. Keep work on `develop` in the shared checkout.
- Use Task to track the work, record decisions and validation in the task, inspect the final diff, and report concrete check results.
- Keep process instructions in `.docs/rules/`. Put architecture and product design in `.docs/design/`. Do not recreate `.docs/guidance/` or add extra files to the `.docs/docs/` root.
