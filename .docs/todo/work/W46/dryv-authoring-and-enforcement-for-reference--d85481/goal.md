---
{id: GOAL-GRP-FAA224D85481,name: Dryv authoring and enforcement for Reference goal,type: documentation,extra: {created_at: 2026-11-13T07:26:23.628Z,group: GRP-FAA224D85481}}
---

# Goal

Make Dryv expressive enough that `dryv/contracts/schemas/mzizi/reference.ts` states every rule it needs in authoring code, with no comments that apologise for something Dryv or the SQL pack cannot do. Today the file carries about a dozen such comments: longer cycles, supersession within one scheme, overlapping effective windows, uniqueness over nullable scope columns, partial indexes, composite foreign keys, numeric precision and cross-schema relations that are not yet resolvable.

Success means each gap is closed by a small, general Dryv feature (not a Reference-specific hack), the matching comment is deleted from `reference.ts`, the rule is declared in authoring code, and the Rust SQL pack generates the enforcing SQL. Each feature must stay portable: it extends the closed expression and storage IR, and every pack either lowers it or reports it as unsupported at compile time. Work is done in short steps, one step per task, and the owner reviews after each step before the next begins.
