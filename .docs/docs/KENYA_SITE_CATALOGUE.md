---
{id: DOC-KENYA-SITE-CATALOGUE,name: KENYA_SITE_CATALOGUE,type: documentation,tags: [website,kenya,catalogue,planning]}
---

# Kenya site catalogue

The catalogue records which kinds of Kenyan public sites Mzizi knows about, the domain patterns that suggest where more of them are, and the sites actually seen. Data: `engine/database/fixtures/research/ke-site-families.json` and `ke-pilot-sites.json`, loaded with `bun src/cli.ts seed research`. Everything here is agent research dated 2026-11-02 and **unverified and legally unassessed**; no site is `active` and none has an assessment, so the collection gate refuses all of them.

## Families and patterns

| Family | Kind | Pattern (proposed) | Subjects | Status |
| --- | --- | --- | --- | --- |
| `ke/county-government` | geographic unit | `{county}.go.ke` | county units (47 from the boundary import) | the pattern comes from the project owner; spellings vary (joined or hyphenated), so two candidates are generated for multi-word names |
| `ke/county-assembly` | geographic unit | `{county}assembly.go.ke` | county units | as above |
| `ke/ngcdf` | geographic unit | `{constituency}.ngcdf.go.ke` | constituency units | cannot expand yet: no constituency boundaries are imported |
| `ke/ministry` | institution type | `{ministry}.go.ke` | ministry institutions | cannot expand yet: no institutions are imported; many ministries use other hostnames |
| `ke/independent-body` | independent body | none | none | commissions and agencies share traits, not hostnames (`iebc.or.ke`, `knbs.or.ke`) |

Expansion (`mzizi-data expand-patterns <family>`) makes no network request. With the 47 counties imported it creates 47 expected sites per county pattern (tested in `tests/test_slice_geoboundaries.py`), each linked to its county unit and its family with basis `pattern`, and records the candidate hostnames in a check; no domain row exists until a probe confirms one. Example candidates: `Taita Taveta` gives `taitataveta.go.ke`, `taita-taveta.go.ke`; `Murang'a` gives `muranga.go.ke`.

## Sites seen

| Site | Host(s) | Seen | Notes |
| --- | --- | --- | --- |
| `ke/iebc` | www.iebc.or.ke | one GET of the home page and the party list page | custom HTML, PDF resources by category, no robots.txt (an HTML page is returned) |
| `ke/parliament` | www.parliament.go.ke, parliament.go.ke (alias) | home page and the budget documents page | Drupal, PDFs under `/sites/default/files/` |
| `world/geoboundaries` | www.geoboundaries.org | API metadata | not Kenyan; supplies the boundary data |

Not readable from this machine on 2026-11-02: `www.knbs.or.ke` and `www.treasury.go.ke` (connection failed, not retried), `new.kenyalaw.org` and `www.nairobi.go.ke` (answered with a redirect that was not followed). They are not in the registry.

IEBC and Parliament share the trait `section:downloads` and `section:publications` and are linked by a `shares_module` relation (document listings with PDF links, different markup); both are members of `ke/independent-body` with basis `agent`.

## Counts and counting rules (dev database after `reset` and `seed research`)

Run `mzizi-data catalogue-report`. Rules: families and patterns are registry records, not claims that sites exist; "sites" are `website.sites` rows by status (3 `profiled`); expected sites are candidates and are never counted as known sites; domains are rows valid today (4: one primary for IEBC, a primary and an alias for Parliament, one for geoBoundaries); sites with an approved assessment: 0. These numbers describe the registry only; they say nothing about how many Kenyan government sites exist.

## Open items for the next run

1. A monitored contact address and bot page, then `MZIZI_USER_AGENT`, then probe the expected county sites (rate 0.2 to 0.5 per second, robots respected, stop on any refusal). Exceptions (other domains, abbreviations, dropped words) become subject overrides.
2. Constituency units and ministry institutions, then the other two patterns.
3. Re-read KNBS, the Treasury, Kenya Law and the Nairobi site from a network that reaches them, and register what is found.
4. Human assessments for each site before any collection, and the Kenya jurisdiction dossier at `pilot`.
