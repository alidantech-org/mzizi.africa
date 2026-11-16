# Example seed CSV files

`data/<scope>/<domain>/<table>.csv` is the rows of `<domain>.<table>`, so `data/global/reference/values.csv` is `reference.values`.

A seed row never carries ids or system fields. It has the table's natural key (`code`), its data, and links written as the target's code: `values.scheme_code` names a row of `schemes.csv` by its `code`. The loader assigns the ids (derived from the table and the code, so they never change) and fills `version` and the audit dates. `x-seed` in `../reference.schema.json` lists the allowed and required columns of each table.

Check a seed tree with `uv run mzizi-manifest data <folder>`; try `uv run mzizi-manifest data source/schema/database/_example`.
