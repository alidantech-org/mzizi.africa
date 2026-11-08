---
{id: DOC-DATA-DIR-INVENTORY,name: Old .data directory inventory and dispositions (2026-11-08),type: documentation,tags: [filesystem,inventory,seed,legacy]}
---

# `.data` inventory and dispositions

The user authorized moving useful old artifacts out of the git-ignored `.data/` directory into an ignored, classified subtree under `seed/` with a manifest describing their registry treatment, and explicitly excluded `.data/raw`. Content was inspected by file kind and by marker scans (private keys, bearer tokens, JWTs, passwords, cloud keys); no secret value was printed or copied. Nothing here is "curated seed data": each item is recorded as what it is.

| Item | Size | What it is (origin / role) | Credential-bearing? | Disposition | Access class |
|---|---|---|---|---|---|
| `backups/` (29 files) | 6.4 GB | `pg_dump` snapshots of the earlier Dryv-entity databases (internally derived, programmatically generated, role `backup`) | Not scanned (binary); may contain personal data and development account rows | Moved to `seed/generated/legacy-artifacts/backups/`; registered by `manifests/legacy-artifacts.yaml` (entry `backups`) | `private` |
| `objects/` (18,042 files) | 6.3 GB | Content-addressed bytes of the old local directory store (`objects/sha256/aa/bb/<sha256>`); role `object_store`; externally collected public sources, programmatically stored | No (names are hashes); content not scanned | Moved to `.../objects/`; entry `objects` registers them flat in one logical folder (file name = hash); their old database metadata is gone | `private` |
| `reports/` (93 files) | 3.2 MB | Pipeline reports and logs from earlier engine runs (JSON, text, logs); role `report` | Marker scan: no private keys or bearer tokens | Moved to `.../reports/`; entry `reports` | `internal` |
| `api.log`, `web.log` | 60 KB, 4 KB | Development server logs; role `log` | Marker scan: none | Moved to `.../logs/`; entry `logs` | `internal` |
| `knbs-ca-bundle.pem` | 180 KB | Public CA certificate bundle for a government site chain; role `certificate`; how it was assembled is not recorded | No private key (scanned) | Moved to `.../certificates/`; entry `certificates` | `internal` |
| `dev.env`, `env.local`, `p4-scratch.env`, `real.env` | 4 KB each | Local environment files: database URLs with development role credentials, an OIDC public key, a bot user-agent contact | **Yes** (connection credentials) | **Left in `.data/`**: active commands and docs reference `.data/dev.env`. Never synced (the planner blocks `*.env`). | never published |
| `dev-auth/` (`private.pem`, `public.pem`) | 8 KB | Development token signing key pair | **Yes** (`private.pem` is a private signing key) | **Left in `.data/`**, never synced (private-key marker blocks it even if selected). Rotate if it ever left this machine. | never published |
| `raw/` | 4.0 GB | The earlier, already uploaded, unstructured raw collection | not inspected (excluded) | **Excluded and untouched**: not hashed, not scanned, not synced, not moved. The planner refuses any manifest whose root, source path, include rule or logical folder contains `raw`, and the database refuses a root folder named `raw`. Existing uploaded raw objects are not deleted or reorganized; reconciliation is separate work. | n/a |

## Where things are now

- Ignored subtree: `seed/generated/legacy-artifacts/{backups,objects,reports,logs,certificates}` (listed in `seed/.gitignore` through `/generated/`; nothing of it is in Git). Regeneration is not possible for backups and objects; they exist only here and (once synced) in S3, so verify registration before deleting anything.
- Tracked manifest: `seed/manifests/legacy-artifacts.yaml`.
- Moves were same-filesystem renames; no file content changed. Active references to `.data/dev.env` and the dev auth keys are unaffected because those files did not move.

## Registration status

The plan resolves (7 logical folders, 18,167 files; credential-like names and private keys are blocked) and previews cleanly. Whether the bytes have been uploaded and registered is recorded in the task `TSK-3EA8C40B0F60` progress notes: it requires the existing S3 environment variables, which must be present when `uv run mzizi-filesystem sync --manifest seed/manifests/legacy-artifacts.yaml --apply --actor <account>` runs.


## Final disposition (8 November 2026, later)

The `.data` directory is retired. Rules now in force:

- **Environment values live only in the repository-root `.env`** (git-ignored). `dev.env` and `env.local` were merged into it (existing keys win); `p4-scratch.env` and `real.env` were not merged because they conflict with `dev.env`.
- **Security files** (`dev-auth/private.pem`, `public.pem`, and the four retired env files) were published through `seed/manifests/security-files.yaml` into the private `/security` folder (`private/` prefix, role `certificate`, `allow_sensitive` honoured only for private entries). Read them with `uv run mzizi-filesystem secure-get <path>` or `mzizi_filesystem.secure.fetch_secure_file`, which verifies the hash and caches the file with mode 0600 under the git-ignored `.local/secure/` (override with `MZIZI_SECURE_DIR`). The web dev signer reads `.local/secure/dev-auth/`.
- **`.data/raw`** (4 GB historical collection) was never uploaded; on the user's explicit instruction of 8 November 2026 it was deleted locally. The six security files were verified byte-identical in S3 before the whole `.data` directory was removed. `.data` no longer exists.
