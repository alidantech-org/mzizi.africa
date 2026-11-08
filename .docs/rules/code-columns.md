---
{id: RULE-CODE-COLUMNS,name: Code columns,type: rule,tags: [database,naming,identity]}
---

# Code columns

A `code` is the stable, human-readable identity of a record. It exists so people, manifests, seeds, logs and other systems can name a record without a database id, and so the same record has the same name in every environment.

## Rules

1. **The column is named exactly `code`** in every table that has one (`roles.code`, `institutions.code`, `folders.code`, `files.code`). Never `registry_code`, `seed_code`, `role_code` or any other prefixed form. The table already says what the code is for. This rule overrides the general "meaning first" naming guidance in `.docs/improvements/schema-redesign/README.md` for identity codes only. Columns that hold a code *of another thing* keep a qualified name (`jurisdiction_code`, `country_code`, `currency_code`) because there it is a different fact.
2. **One shape everywhere.** A code is dot-separated segments. A segment is lowercase letters, digits and underscores, starting with a letter or digit: `^[a-z0-9][a-z0-9_]*(\.[a-z0-9][a-z0-9_]*)*$`, at most 255 characters and 16 segments. No hyphens, slashes, colons, spaces or uppercase. (The shape is also a valid PostgreSQL `ltree`, so hierarchy queries stay cheap.)
3. **Hierarchical by prefix.** The code of a child record starts with the code of its parent record and one more segment: `seeds` → `seeds.global` → `seeds.global.auth` → `seeds.global.auth.roles_csv`. A parent's code is a prefix of every descendant's code, so "everything under X" is `code = X OR code LIKE X || '.%'`.
4. **Reproducible.** Where a record has a natural name, its segment is computed from that name by one function, never invented per call: lowercase, every run of characters outside `[a-z0-9]` becomes one `_`, leading and trailing `_` removed (`legacy-artifacts` → `legacy_artifacts`, `roles.csv` → `roles_csv`). The same input gives the same code on any machine. SQL (`filesystem.code_segment`) and Python (`mzizi_filesystem.codes.code_segment`) implement it identically and are tested against each other.
5. **Global within its table.** `UNIQUE (code)` on the table. Codes are never reused for a different record. A segment collision (two names that slug to the same segment) is an error to resolve by naming, not silently suffixed.
6. **Stable.** A code is checked against its parent's code when it is set (a coded child must sit under the nearest coded ancestor's code). After that it does not change when the record is renamed or moved for presentation; it changes only by a deliberate, recorded migration that also recodes the descendants.
7. **Scope.** A top-level code names a domain or a namespace (`seeds`, `security`, `legacy_artifacts`, `iebc`, `electoral_manager`). Roots are chosen by people; everything below is derived.
8. **Where a code is required.** Roles, institutions and any table whose rows are loaded from seeds or manifests have a mandatory code. Run-time records that only need an id (uploads, tags assigned by a person) do not need one.
9. **Enforcement.** Each `code` column carries `CHECK (code ~ '<shape>')` and `UNIQUE (code)`; a test scans every `code` column in the database and fails if one lacks the shape check.
