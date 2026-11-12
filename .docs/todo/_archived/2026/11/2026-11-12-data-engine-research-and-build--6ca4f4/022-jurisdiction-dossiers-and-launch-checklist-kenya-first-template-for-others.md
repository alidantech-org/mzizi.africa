---
{id: TSK-9E12E350EDCA,name: "Jurisdiction dossiers and launch checklist: Kenya first, template for others",type: task,status: archived,priority: medium,created_at: 2026-11-02T08:27:29.228Z,updated_at: 2026-11-12T05:47:39.480Z,due_at: 2026-11-30,order: 22528,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T09:52:46.948Z},{from: in-progress,to: archived,at: 2026-11-12T05:47:39.480Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-9E12E350EDCA/1793613166950-start,started_at: 2026-11-02T09:52:47.358Z,ended_at: 2026-11-12T05:47:39.480Z,end_error: "EROFS: read-only file system, open '/home/alidante/.local/share/taskcode/projects/f166568a11ef213d/.init.lock'"}]}},archived_at: 2026-11-12T05:47:56.094Z}
---

# Jurisdiction dossiers and launch checklist: Kenya first, template for others

## Goal
Produce the Kenya jurisdiction dossier and a reusable template, and name the accountable owners, so production collection in any country is preceded by a documented legal and privacy review rather than by generated structures.

## Context
Read .docs/docs/LEGALITY_SAFETY_AND_COMPLIANCE.md first, then the Legal and source approval gate section of .docs/docs/WEBSITE_DESIGN.md. Public visibility is not permission, technical validation is separate from legal approval, and agents may draft but never approve. This is an engineering baseline, not legal advice: qualified counsel must review before production collection. Work only on develop, record progress here and tick items with task check. Kenya baseline references include the Constitution (Articles 31 and 35), the Access to Information Act 2016 and regulations, the Data Protection Act 2019 and regulations with ODPC guidance, the Computer Misuse and Cybercrimes Act 2018, and the Copyright Act 2001. Verify current consolidated texts, amendments and regulator guidance; do not rely on summaries. South Africa, Nigeria and Tanzania need their own dossiers before Wave 1 collection beyond licensed bulk downloads. African Union Malabo Convention status must be checked, not assumed.

## Acceptance checklist
- [x] Kenya dossier recording regulator, official legislation repository, applicable laws with the date each was checked, treaty status and open questions for counsel.
- [x] Dossier template and the section 13 launch checklist as a working document, with a first-source pilot limited to licensed bulk data.
- [ ] Named accountable owners for legal review, privacy, source approval, security and incident response, and correction and takedown handling.
- [ ] Assessment of every AI and cloud processor used with source content, covering location, retention, training use and transfer basis.
- [x] Records for ZA, NG and TZ marked not_reviewed with the research still required.

## Progress
Done: the Kenya dossier (.docs/docs/KENYA_JURISDICTION_DOSSIER.md: regulators, repositories, laws with checked dates including the 2025 cybercrimes amendment and its court challenges as found by web search, the Malabo status from secondary sources, decisions already in the engine, open questions for counsel, the section 13 checklist with status), a reusable template, and dossier records for Kenya, South Africa, Nigeria and Tanzania at launch stage research (seed research/dossiers.json; the gate needs pilot or production). Not done, needs a human: naming the accountable owners (the dossier lists the six roles as unnamed), and a real processor assessment (the dossier lists processors, including the external AI provider, and states plainly that terms, location, retention, training use and subprocessors were not assessed). The law lists were not checked against official consolidated texts and no counsel was involved. Checklist items 3 and 4 therefore stay open on purpose.
