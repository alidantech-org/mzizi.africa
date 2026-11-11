---
{id: DEC-FILESYSTEM-READABLE-KEYS,name: Decision - readable path keys in the bucket,type: decision,tags: [filesystem,s3,seed,manifest]}
---

# Decision: the bucket mirrors the registry with readable path keys

Date: 2026-11-11. Decided by the user. Supersedes the content-addressed key layout (`<access>/content/sha256/aa/bb/<sha256>`) recorded on 2026-11-08 in task `TSK-3EA8C40B0F60`.

## Decision

1. **The object key is the logical path.** The current version of a file is stored at `<access>/<folder path>/<file name>`, where `<access>` is the effective access class of the folder (`public`, `internal`, `restricted`, `private`) and the rest is exactly the path recorded in `filesystem.paths`. Someone browsing the bucket sees the same folders and file names as the registry. Names are the official downloaded name or the local name; they are never replaced by a hash.
2. **Access stays the first key segment** because anonymous read is granted by prefix: only `public/` is anonymously readable.
3. **A key is never silently overwritten.** `filesystem.file_versions.s3_key` is unique, the database checks at commit that every key equals the key computed from the path, and before any write the service reads the key: it writes only when the key is empty, already holds the same bytes, or holds the bytes of the same file's current version, which is first preserved (rule 4).
4. **Versioned files keep history in a version folder.** When a file with `retention = preserve_history` receives different bytes, the superseded bytes are copied to `<access>/<folder path>/_versions/<file name>/r<NNNN>/<file name>` and verified before the plain key receives the new bytes. Files with `retention = replace_current` have no version folder: the plain key is replaced, except that a pinned or relation-referenced version is always preserved in the version folder first. Which files are versioned is stated in the manifest (`versioning: versioned | current`), never inferred from the name.
5. **Deduplication is by content hash, decided per registration** (`on_duplicate`): `keep_both` stores each logical file at its own readable key, creating the second by a server-side copy instead of an upload; `reuse_existing` creates nothing and returns the file that already holds the bytes; `reject` fails. Deduplication never crosses access classes. `mzizi-filesystem duplicates` lists equal content. Shared physical keys no longer exist.
6. **Same folder and same name is a decision, not an accident** (`on_name_conflict`): `new_version` (default) records a new revision of that file; `keep_both` stores the newcomer as `<stem>~<sha8>.<ext>`; `reject` fails.
7. **Reserved names.** `_versions` cannot be a folder or file name. A root folder cannot be named `raw`, `tmp` or `content`. A folder and a file in the same folder cannot share a name.
8. **Renames, moves and access changes relocate objects.** They copy every affected object to its new key, verify, repoint the rows in one transaction, and return the superseded keys for explicit cleanup.
9. **One seed manifest.** `seed/manifest.yaml` (authored) and `seed/manifest.lock.yaml` (generated) are the only seed manifests. `seed/manifests/`, the generic `filesystem-sync` manifest kind and its schema are removed. Per-folder facts stay in `_folder.yaml`. Site-structure `manifest.yml` files are source contracts, not seed manifests, and are unaffected.
10. **Fresh start.** Every filesystem registry row and every object outside `public/raw/` is removed and the local `seed/` tree is uploaded under the new layout. `public/raw/` is an archive that is never listed for deletion, written or registered.

## Why

The content-addressed layout made the bucket unreadable without the database. The user needs to inspect real files and folders directly in the bucket. Hash identity is kept in the database and in object metadata (`sha256`), so verification, duplicate detection and recovery after an interrupted run are unchanged.

## Consequences

- Equal bytes at two paths are stored twice under `keep_both`.
- Renaming a large folder costs one copy per object.
- An object changed directly in the bucket diverges from the registry until `mzizi-filesystem verify` reports it.
