---
{id: DOC-KENYA-DOSSIER,name: KENYA_JURISDICTION_DOSSIER,type: documentation,tags: [legal,compliance,kenya,dossier]}
---

# Kenya jurisdiction dossier (research stage)

This is the working dossier required by `LEGALITY_SAFETY_AND_COMPLIANCE.md` sections 9, 12 and 13. It is an engineering record, **not legal advice**. Launch stage in the database (`website.dossiers`): **research**. The collection gate refuses collection until a human moves it to `pilot`, so this document records what is known and what is not.

## Regulators and repositories

| Role | Body | Starting point |
| --- | --- | --- |
| Official legislation | Kenya Law | https://new.kenyalaw.org/legislation/ |
| Data protection | Office of the Data Protection Commissioner (ODPC) | https://www.odpc.go.ke/data-protection-laws-kenya/ |
| Access to information | Commission on Administrative Justice | https://ombudsman.go.ke/access-information-center |
| Cybersecurity / cybercrime | KE-CIRT (Communications Authority), NC4 | https://ke-cirt.go.ke/law-regulations/, https://nc4.go.ke/regulations |

## Laws to apply (checked 2026-11-02 by an agent; not verified against official consolidated texts)

| Law | Why it matters to Mzizi | State of knowledge |
| --- | --- | --- |
| Constitution of Kenya 2010, Articles 31 and 35 | privacy; the right of access to information held by the State | named in the baseline; no technical licence to automate every site follows from Article 35 |
| Access to Information Act 2016 and Regulations 2023 | formal route when material is not openly published | use for anything beyond open bulk data |
| Data Protection Act 2019 and the 2021 regulations | public availability of personal data is not an exemption; purpose, minimisation, retention, rights, security, transfers; possible registration and DPIA | applicability to Mzizi's actual processing not assessed |
| Computer Misuse and Cybercrimes Act 2018, amended by the 2025 Amendment Act (No. 17 of 2025) | unauthorised access, interference; the 2025 amendment took effect on 4 Nov 2025, was challenged in the High Court, and some provisions were suspended or reported unconstitutional | current legal effect must be read from the judgment, not from press summaries |
| Copyright Act 2001 (Cap. 130) as amended | rights in reports, tables, maps, photographs; no automatic public-domain status for government documents | per-source licence and rights-holder assessment needed |

Treaty: the African Union Malabo Convention entered into force in June 2023. Search results dated up to 2026 indicate Kenya has not ratified it (secondary sources; confirm on the AU treaty status list). It informs but does not replace Kenyan law.

## Decisions already taken in the engine

Automated access is bounded, identified and rate limited; robots.txt is respected as an operational rule, not as a legal conclusion; no authentication, CAPTCHA or evasion; personal data is excluded by default; a missing, overdue, restricted or out-of-scope assessment denies collection; a licence is recorded verbatim per document and an unconfirmed licence is labelled so; promotion needs a licence, a human reviewer and a current legal status.

## Open questions for counsel

1. Must Mzizi (or its operating entity) register with the ODPC as controller or processor, and is a DPIA required for office-holder data?
2. What is the lawful basis, retention period and correction process for public-office information, and what counts as proportionate?
3. How do the 2025 cybercrimes amendment and the litigation affect automated reading of public government sites at low volume?
4. Licences and rights holders for the sources in the catalogue (IEBC, Parliament, KNBS, Treasury, Kenya Law); database rights; permission for republication.
5. Hosting location of raw documents, backups and logs; cross-border transfers; processors.
6. Whether source content may be sent to the external AI provider used by authoring agents (see below).

## Launch checklist status (section 13)

| Item | Status |
| --- | --- |
| Legal entity and operational footprint identified | open: not recorded in the repository |
| Legislation repository, privacy regulator, cyber authority identified | done (table above) |
| Current laws reviewed (access, privacy, cybercrime, copyright, records, sector) | partly: list assembled, texts not read, counsel not involved |
| Amendments, regulations, guidance, treaty status checked | partly: the 2025 amendment and the Malabo status noted from secondary sources |
| Registration, representative or DPO, DPIA, localisation or transfer conditions | open |
| Allowed source categories, methods, prohibited material | done in the compliance baseline and engine |
| Source terms, licence and reuse review | open per source: no source has an assessment |
| Request rate, identification, caching, stop and complaint procedures | engine done; the monitored contact address and bot page are open |
| Personal-data exclusions, lawful bases, notices, retention, rights handling | exclusions implemented; the rest open |
| AI and cloud processors and cross-border transfers | assessed below |
| First source inventory and limited pilot approved | open: pilot structures exist, none approved |
| Structure activation gated by source approval | done (gate) |
| Reviewer, evidence, decision, conditions, next review date recorded | open: no reviewer named |

## Accountable owners (to be named by the project owner)

Legal and jurisdictional review: **unnamed**. Privacy and data protection: **unnamed**. Source approval and licensing: **unnamed**. Security and incident response (`mzizi-data stop`, quarantine): **unnamed**. Structure and extractor operation: **unnamed**. Corrections, complaints and takedowns: **unnamed**. The engine and records need named accounts (reviewer grants in `identity.grants`) before any approval can be recorded; agents cannot hold these roles.

## Processors and cross-border flows (as of 2026-11-02)

| Processor | Role | Data sent | Notes |
| --- | --- | --- | --- |
| Anthropic (AI assistant used for research and authoring sessions) | external AI provider | page excerpts and saved public markup in prompts; no personal data was deliberately sent | provider terms, location, retention, training use and subprocessors not assessed here; do not send personal, confidential or restricted source content until assessed |
| GitHub (geoBoundaries release files) | download host | none | public files |
| World Bank API, geoBoundaries API | data providers | none | public APIs |
| Local PostGIS and local directory store | storage | all preserved evidence | development machine only; production hosting not decided |

## Other jurisdictions

South Africa, Nigeria and Tanzania have dossier records at stage `research` with candidate law lists from general knowledge (marked unverified). Nothing beyond licensed bulk downloads may be collected there until each has a reviewed dossier. Template: `JURISDICTION_DOSSIER_TEMPLATE.md`.
