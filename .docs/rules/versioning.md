---
{id: RULE-VERSIONING,name: No invented versions,type: rule,tags: [schema,manifest,agent-guidance]}
---

# Versioning rule

Mzizi is pre-release and every consumer of a schema, manifest or seed file lives in this repository and changes in the same commit. Versions therefore add clutter and invite half-migrated files. These rules bind every contributor and every AI agent.

## Where a version may appear

- A version may appear **inside a file** as a field, when the owner has approved that field for that file type. The job spec's `version` is approved because specs are stored in the run ledger and hashed.
- Database releases keep their own numbering (`0001_init`), and the HTTP API keeps its `/v1/` path prefix. Both already exist and stay.

## Where a version must not appear

- **Not in folder names.** Use the current `source/schema/sources/` directory without a version suffix.
- **Not in file names.** Use `vocabulary.yaml`, never `vocabulary.v1.yaml`.
- **Not in new `schema:` or `schema_version:` markers** inside manifests, until the owner asks for them.

## Agents must not invent versions

- Never introduce a new version number, version folder, version suffix, version field, "v2" copy or compatibility shim on your own initiative. This includes bumping an existing version.
- When a format changes, change the schema, the files and the validator together in one commit. Do not keep the old format alongside the new one.
- If you think a version is needed (for example two formats must coexist), stop and ask the owner. Record the answer in the task or a decision before adding it.
- Existing version markers stay as they are until a task explicitly removes them; do not add new ones while editing nearby.
