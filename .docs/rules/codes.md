---
{id: RULE-CODES,name: Manifest and row codes,type: rule,tags: [schema,manifest,agent-guidance]}
---

# Codes

Every source, mapping, terms and job-spec manifest, and every database row that a manifest names, has a dotted lowercase `code`. The shape is the same everywhere, agreed with the owner on 16 November 2026.

```text
<scope>.<area>.<table-or-name>.<name>[.<child>...]
```

- **scope** is `global` or a country code (`ke`). A manifest may use items of its own scope or `global`, never another country; `global` uses only `global`.
- **area** is a database group (`reference`, `governance`, `official`, `source`, and so on) when the thing relates to the database. The next segment is then a real table of that group (`ke.governance.holders.office-holders`). Otherwise the area is a system area named by use: `engine`, `web`, `extraction` (the list is `systemArea` in `source/schema/sources/common.schema.json`).
- **name and children** are kebab-case segments in the same hierarchy; a child extends its parent's code.

## Rules by kind

- **Source:** `<scope>.source.<websites|apis>.<name>`, where the table matches the manifest's `kind`. It equals `source.sources.code`. Modules have no codes of their own: their full name is the source code plus the module name.
- **Mapping:** named after the first table it yields: `<scope>.<schema>.<table>.<name>`.
- **Terms:** a database area and table when it feeds one (`ke.reference.patterns.office-names`), otherwise a system area (`global.web.classification`).
- **Expected table columns** (what a PDF or spreadsheet table should contain) are not a manifest of their own: they are the object form of a mapping's `inputs`.
- **Job spec:** `<scope>.engine.jobs.<name>`, in the optional `code` field of the spec; its files live under `jobs/`.
- **Generated database schemas:** each `source/schema/database/<group>.schema.json` has the code `global.database.<group>` (`database` is a system area), and each table in it carries `x-code` = `global.<group>.<table>`. A seed CSV for a table is the same code with the scope changed: `data/ke/reference/values.csv` is `ke.reference.values`.
- **CSV seed files** are already shaped this way by their path: `data/<scope>/<domain>/<table>.csv`.

## The folder mirrors the code

A file's folder path under `seed/` mirrors its code. `seed/mappings/ke/governance/holders/office-holders.yml` has the code `ke.governance.holders.office-holders`; a source's code is the folder that holds its manifest, `seed/sources/ke/source/websites/iebc/`. The first folder names the kind: `sources`, `mappings`, `terms`, `jobs`.

`uv run mzizi-manifest refs [folder]` checks all of this: the area and table against the generated `source/schema/database/` files, the kind rules, the path, unknown, duplicate and wrong-kind references, scope visibility and cycles. The flat `_example/` folders use `--no-paths`.

Row codes inside data (`source.document-kind.report`) are data, not manifests, and follow the code-column rule only. Never invent a new area, scope shape or segment rule without asking the owner.
