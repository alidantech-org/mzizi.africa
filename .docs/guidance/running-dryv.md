---
{id: DOC-DRYV-RUN-GUIDE,name: Running Dryv in this repository,type: documentation,tags: [dryv,api,agents]}
---

# Running Dryv in this repository

Dryv generates the NestJS API in `source/backend/api` from the contracts in `dryv/contracts`. It does run on this machine: the Dryv checkout is at `~/Projects/personal/alidantech-org/codepot/dryv` (pinned engine `6dba3100`), `uv` and `bun` are installed, and a full generation takes about three minutes. If a session reports that Dryv "cannot run here", the engine API was not started: follow the steps below before concluding anything.

## Steps

1. **Check the contracts** (after editing anything in `dryv/contracts`): `cd dryv && bun run check`. It typechecks, audits, compiles and checks the access rules and the exchange schema. Fix it before generating.
2. **Start the Dryv engine API** (it listens on 8750 and starts four template renderers on 8765 to 8768):

   ```bash
   cd ~/Projects/personal/alidantech-org/codepot/dryv
   (nohup uv run --project source/engine/python/api dryv-api serve --host 127.0.0.1 --port 8750 --template-server source/engine/python/api/dryv.server.yaml > /tmp/dryv-api.log 2>&1 &)
   ```

   Wait about 20 seconds until the log shows `Running on http://127.0.0.1:8750`. A request to `/` answers 404; that is normal.
3. **Generate** from the repository root: `DRYV_HOME=~/Projects/personal/alidantech-org/codepot/dryv bun $DRYV_HOME/source/apps/cli/bin/dryv.ts --api http://127.0.0.1:8750 --yes --no-input generate`. The first time on a machine run the same command with `trust --yes` instead of `generate`.
4. **The run ends "failed" at the typecheck stage whenever a new operation was added.** That is expected: use cases are scaffolded, but the feature's `*.service.impl.ts` is project-owned and never regenerated. Run `cd source/backend/api && bunx tsc -p tsconfig.json --noEmit`, and for each missing method add, in `src/modules/<group>/<feature>/<feature>.service.impl.ts`, the use case import, the constructor parameter and a method that returns `this.<name>UseCase.execute(input)`. The abstract class in `<feature>.service.ts` lists every method required. Repeat until the typecheck is clean.
5. **Adopt the shared list helper and verify**: `cd dryv && bun run adopt:list && bun run generated:check && bun run access:export`. A message "cannot adopt ... unexpected scaffold shape" for a hand-edited use case (such as `find-structure-versions`) is harmless.
6. **Test**: `cd source/backend/api && bun run test` (about 15,900 unit tests); integration specs with `TEST_DATABASE_URL` pointing at `mzizi_test`, one file at a time.
7. **Stop the server by PID**: `fuser -k 8750/tcp`. Never use `pkill -f` from the agent's shell; it matches the shell's own command line and kills it (exit 144).
8. Commit the contracts, the generated output and the hand-added service methods together. Generated output under `source/backend/api` is tracked; Dryv state (`.dryv`, `dryv/staging`) is ignored.

## Traps

- Two relations from one entity to the same target collide; keep the second as a plain id. A relation named `version` collides with the base column. The audit forbids a `confidence` column on data rows (use `score`).
- Renames and removals leave stale generated files; `bun run generated:stale` finds stale entities. Delete them by hand.
- New read operations that expose personal or restricted data (contact points, restricted identifier schemes) need a reviewer-only surface; `ContactPoint` is deliberately entity and DTO only, with no public read endpoint.
- Generation never touches the database; schema changes still go through the database engine's migrations.
