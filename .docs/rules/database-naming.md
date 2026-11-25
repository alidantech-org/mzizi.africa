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

## Term, identity and partition columns (FOUNDATION_REDESIGN, approved 2026-11-25)

10. **`_term` means a vocabulary term.** A column ending in `_term` (`kindTerm` in contracts) is a uuid foreign key to `vocabulary.terms.id`. Its scheme is named in the column description and checked by Mzizi's generated scheme trigger (`term(scheme)` in `dryv/contracts/schemas/postgres/_links.ts`). `_id` always means a real table. Meaning words are used the same way everywhere: `kind`, `status`, `role`, `method`, `basis`, `category`.
11. **Identity-backed tables** reuse `identity.identities.id` as their primary key and carry `identity_kind`; the pair is a composite foreign key, so a row can never extend an identity of another kind.
12. **Partitioned tables** put the partition key in every primary and unique key, and every link into them carries the key too (`post_country_id`, `retrieved_at`).
13. **No provenance columns.** No domain table has a citation, source or observed-at column; `source.evidence` links citations to rows. `dryv/tools/audit-main-domain-contracts.ts` enforces this and the approved table inventory.
