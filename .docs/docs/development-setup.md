---
{id: DOC-3D28B3806CE8,name: Development Setup,type: documentation}
---

# Development Setup

## Task workspace

Run commands from the repository root:

```sh
task                 # workspace overview
task list            # active tasks
task group list      # API, Mobile app, and Sites groups
task show <id>       # inspect an activity
task run             # open the local Task dashboard
task doctor          # check workspace health
```

Create work with `task create --title "..." --group <group-id> --status planned --priority medium --tag area,topic`. Use `planned`, `in-progress`, `blocked`, or `completed` statuses and add dependencies when one activity genuinely gates another.

## Flutter mobile

Use `apps/mobile/README.md` as the source for SDK and platform setup. The app reads compile-time values such as `MZIZI_API_BASE_URL` through Dart defines; a `.env.local` file is not automatically loaded unless application code explicitly implements that behavior. Use the API origin reachable from the chosen target (Chrome, Android emulator, or physical device), and keep backend secrets out of the client.

## API and sites

Follow each application README and package scripts. The legacy Python service may require environment and database configuration; inspect `services/api/README.md` before starting it. The public and research sites have separate ownership and scripts; consult their package manifests rather than assuming one root command covers both.
