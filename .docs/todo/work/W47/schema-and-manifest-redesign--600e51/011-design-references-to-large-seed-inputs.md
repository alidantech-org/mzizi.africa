---
{id: TSK-2BD926EEB505,name: Design references to large seed inputs,type: task,status: planned,priority: medium,created_at: 2026-11-16T15:23:17.899Z,updated_at: 2026-11-16T15:23:17.899Z,depends_on: [TSK-9A8E9A0A16B1],order: 11264}
---

# Design references to large seed inputs

## Goal

Decide how seed data that is too large to commit (county boundary GeoJSON, shapefiles, PDFs, spreadsheets) is prepared locally, identified exactly and linked from the seed, so the seed tree stays small and text-only while every file used remains traceable, verifiable and re-fetchable.

## Context

The owner decided on 16 November 2026 that large files such as GeoJSON are not stored in the seed; a locally prepared copy is used, and the seed still links to the file that was used. The database already models this: `filesystem.file_versions` holds an object key, `sha256`, size and content type; `source.captures` records the retrieved URL, content hash and file version; `geography.datasets` and `geography.geometries` carry `file_version_ref_id` and `source_ref_id`; `source.citations` and `source.evidence` tie claims to files. The engine already has `extraction.geojson` and an input root (`.dev/inputs/`, git-ignored). This task belongs to the schema and manifest redesign group. Nothing is built until the owner approves the design in a task comment, and no seed file is added without the owner seeing it first.

## Acceptance checklist

- [ ] Design: Set the size and type rule for a seed file (proposed: text only, about 1 MB) and what the validator does with a larger file.
- [ ] Design: Define the artifact reference record (origin URL, licence, sha256, size, media type, retrieved date, local path under the input root) and where it lives: a seed manifest entry, a CSV row in `filesystem.file_versions` and `source.captures`, or both.
- [ ] Design: Define the check that re-hashes a local copy against its record, how a missing local copy is re-fetched or reported, and the upload to the object store.
- [ ] Design: Define how geometry gets into the database: a job (fetch or read the artifact, `extraction.geojson`, mapping to candidates, review) rather than a CSV of geometries.
- [ ] Approval: The owner has approved the design in a task comment, and the comment is quoted under Notes.
- [ ] Build, only after approval: Add the reference record to the seed manifest schema and the check to the manifest package, with tests using a small stand-in file.
- [ ] Build, only after approval: Document the workflow in `seed/README.md` and the manifest package README.
- [ ] Build, only after approval: `task validate` and the relevant checks pass, and every README and design link that mentions the changed files is updated.

## Notes

Record findings, rejected options and the approval here.

## Progress

16 November 2026: input found for this design. The archived seed (`.dev/archives/seed/_fixtures/extraction/geoboundaries/`) holds geoBoundaries outlines of Kenya: `KEN-ADM0` (the country, 183 KB simplified) and `KEN-ADM1` (the 47 counties, 862 KB simplified), each with a metadata file. The ADM0 metadata gives `boundaryID` KEN-ADM0-21065076, year represented 2020, source "RCMRD GeoPortal, geoBoundaries", licence "Public Domain", the download URLs under github.com/wmgeolab/geoBoundaries and a build date of 12 December 2023. They are the first inputs the artifact-reference record must describe; the geometry files themselves stay out of `seed/`.
