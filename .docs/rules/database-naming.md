---
{
  id: RULE-DATABASE-NAMING,
  name: Database naming,
  type: rule,
  tags: [database, naming, contracts],
}
---

# Database naming

Applies to every table the Dryv contracts define. The contract audit (`dryv/tools/audit-contracts.ts`) enforces it. The design behind it is in `.docs/design/data/DATABASE_DESIGN.md`.

## Rules

1. **Nothing lives in `public`.** Every table belongs to a domain schema.
2. **Full words, never short forms.** `geography`, `organization`, `statistical`; not `geo`, `org`, `stat`. The audit accepts only the approved schema list below.
3. **Schemas are singular**, one word, no underscore, named for the domain.
4. **Tables are plural**, one word where possible. Use an underscore only when two words are really needed (none today). Uncountable words (`evidence`) are allowed.
5. **Never repeat the schema in the table name.** `geography.units`, not `geography.geography_units`.
6. A table name is unique within its schema; the same word may be reused across schemas (`geography.changes`, `legal.changes`).
7. CHANGED FROM NO FOREGIGN KEYS ACCROSS SCHEMAS TO THERE MUST BE FOREIGN KEYS ACCROSS SCHEMAS FOR PERFECT AND CORRECT LINKAGE
8. **Provenance is not a column.** Data tables carry valid time, record time and version; where a record came from is in the `source` schema.
9. Columns, enums and index names are unchanged by this rule, except that an identity code column is always named exactly `code` and follows `.docs/rules/code-columns.md`. Entity classes keep descriptive names (`GeoUnitEntity` is `geography.units`).
