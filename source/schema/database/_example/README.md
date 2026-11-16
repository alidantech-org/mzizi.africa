# Example seed CSV files

`data/<scope>/<domain>/<table>.csv` is the rows of `<domain>.<table>`, so `data/global/reference/values.csv` is `reference.values`. Every column must exist in `../reference.schema.json`, every required column must be present, ids are UUIDs, and a foreign key (`values.scheme_id`) must name an id in the target table's file or in the database. The ids here are illustrative.
