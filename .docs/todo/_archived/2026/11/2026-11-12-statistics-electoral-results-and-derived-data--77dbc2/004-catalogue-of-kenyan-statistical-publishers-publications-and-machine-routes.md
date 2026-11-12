---
{id: TSK-D4BDEB42D93E,name: "Catalogue of Kenyan statistical publishers, publications and machine routes",type: task,status: archived,priority: medium,created_at: 2026-11-02T19:25:51.749Z,updated_at: 2026-11-12T05:47:32.028Z,order: 4096,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-03T01:24:40.418Z},{from: in-progress,to: archived,at: 2026-11-12T05:47:32.028Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-D4BDEB42D93E/1793669080420-start,started_at: 2026-11-03T01:24:40.990Z,ended_at: 2026-11-12T05:47:32.029Z,end_error: "EROFS: read-only file system, open '/home/alidante/.local/share/taskcode/projects/f166568a11ef213d/.init.lock'"}]}},due_at: 2026-11-02,archived_at: 2026-11-12T05:47:55.562Z}
---

# Catalogue of Kenyan statistical publishers, publications and machine routes

## Goal

Find, register and assess where Kenyan statistics are published, how to get them without scraping where possible, and under what terms, so that loaders have approved sources and the gate has sites to approve.

## Context

The main publisher is the Kenya National Bureau of Statistics, which publishes the 2019 Kenya Population and Housing Census reports by volume (population by county and sub-county, by sex and age, by household, by ethnic community and nationality, by religion, education, disability, ICT and housing), the Economic Survey, the Statistical Abstract, the Kenya Integrated Household Budget Survey and the Kenya Demographic and Health Survey. Others are the Communications Authority (internet, mobile and broadband statistics), the Commission on Revenue Allocation (county fiscal data and marginalisation indices), the IEBC (registered voters and results), the Central Bank of Kenya, the Kenya Open Data portal, the UN OCHA Humanitarian Data Exchange (COD-PS population statistics by administrative unit), WorldPop, the World Bank and the Demographic and Health Surveys programme. For each, record the publication, period, geography level, file format, URL, licence, and whether a bulk or API route exists, then register the site and the document records. Nothing is requested until the gate allows it, and licences are recorded as unassessed until checked.

## Acceptance checklist

- [x] Register the publisher sites (knbs.or.ke, opendata.go.ke, communications authority, CRA, central bank, HDX, DHS programme, WorldPop) in the site registry.
- [x] List each publication with period, geography level, format, route and licence in a seed JSON labelled as custom-prepared from manual research.
- [ ] Probe each registered site through the gate for machine routes (bulk files, APIs, CKAN or OCDS-like endpoints).
- [ ] Record robots.txt, terms and licence findings per site and assess them.
- [x] Add the catalogue to the status document and hand each loader task its approved sources.
