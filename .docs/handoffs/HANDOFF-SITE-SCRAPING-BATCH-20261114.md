---
id: HANDOFF-SITE-SCRAPING-BATCH-20261114
name: Site scraping engine and the 47-site batch, handoff
type: handoff
tags: [engine, scraping, batch, downloads, mongodb, handoff]
extra: {status: halted_by_user_to_resume, date: 2026-11-14, data_deleted: false}
---

# Site scraping engine and the 47-site batch — handoff (2026-11-14)

Work was halted at the user's request and is to continue the next day. Everything fetched is saved; nothing was deleted.

## What exists (all committed and pushed to `develop`, last commit `e9b971c4`)

- **`mzizi site watch URL`**: crawls from a URL alone, saves each page as it arrives, versions only on meaningful change, keeps Markdown with front matter, hunts and downloads files. Pages load over HTTP first and use a browser only when needed (`--render auto`).
- **`mzizi site batch FILE --name N --workers 4`**: runs many sites at once, one process per site, state in `.dev/batches/<name>/` (`state.json`, `log.jsonl`, `passes/`), resumable, graceful stop on SIGTERM, time budget per pass.
- **Layout**: `.dev/websites/<reversed suffix>/<registrable label>/<host label>/` (e.g. `ke/go/ngcdf/kasarani`), pages follow the site's own paths, files under `scraped/files/<type>/` with readable `--<sha8>` names.
- **Storage**: MongoDB `mzizi_dev` (the existing `mongodb` container, no credentials): `pages`, `page_versions`, `generated_files`, `site_links`, `download_queue`, `downloads`, `sites`, `site_aliases`. One shared connection, retries, disk spool at `.dev/spool/` if Mongo is down.
- **Safety rules built in**: robots respected (also for files), blocks and refusals are never worked around, a section that refuses or fails is skipped (three sections stop the crawl), 404 is never a block, disk guard (8 GB free floor, `MZIZI_MIN_FREE_GB`).
- Docs: `source/backend/engine/README.md`, `.docs/design/acquisition/WEB_ACQUISITION_RUNTIME.md`, `SITE_STRUCTURE_SPEC.md` (ranking and `expect`).

## How to resume

```bash
export MZIZI_USER_AGENT='Name/1.0 (+https://your.site/bot; you@your.site)'
cd <repo root>
MZIZI_MARKDOWN_WORKERS=1 uv run mzizi --no-input --json --allow-outside-inputs site batch "$PWD/.dev/batches/main/sites.txt" --name main --workers 4 --max-pages 120 --max-depth 5 --max-seconds 2400 --max-passes 6
```

The batch skips finished sites, requeues files left "downloading", and continues each pending site (saved pages are served from disk and do not use the page budget). `docker start mongodb` first if it is not running. Optional second batch: `.dev/batches/recheck/` (`--name recheck`) holds `ppra.go.ke`.

## State at the halt

- Saved: about 13,000 pages with Markdown, about 17,400 files, about 27 GB under `.dev/websites`; free disk about 30 GB.
- MongoDB: 13,947 page records, 1.14 million link records, download queue 94,602 items (done 19,112; queued 64,974; skipped 6,851 as HTML pages; missing 3,575; failed 99; 3 were in flight and are requeued at the next batch start).
- `main` batch: 24 of 47 sites marked done; `recheck`: 3 of 4.

Done (whole site reached or marked): alidantech.org, dryv.alidantech.org, faidibiz.com, icta.go.ke, five NG-CDF constituencies (kasarani, westlands, langata, makadara, starehe), kenyalaw.org (partial, see below), kisumuassembly.go.ke, klrc.go.ke, mombasaassembly.go.ke, nest.go.tz, ppra.go.ke (see below), tenders.go.ke, www.etenders.gov.za, www.iebc.or.ke, www.parliament.go.tz, www.president.go.ke, www.statssa.gov.za, www.tra.go.tz, www.treasury.gov.za.

Pending, in later passes (pages saved so far): eacc 236, education 474, health 449, judiciary 572, kisumu 442, mombasa 592, nairobi 547, nairobiassembly 804, nakuru 574, nakuruassembly 689, ngcdf.go.ke 518, orpp 412, parliament.go.ke 242, treasury.go.ke 383, www.ec.or.ug 275, www.finance.go.ug 343, www.inec.go.tz, www.judiciary.org.za 480, www.knbs.or.ke 564, www.mof.go.tz 338, www.nbs.go.tz 472, www.parliament.gov.za 480, www.ppda.go.ug 290.

## Things to check first tomorrow

- **`ura.go.ug`** is marked done in the old state but fetched 0 pages: the server closes connections (`Empty reply`). Not worked around. Retry later; the fixed batch keeps such a site pending.
- **`ppra.go.ke`** is marked done in `main` from a false "complete" (request ceiling, since fixed); the `recheck` batch is the live one (460 pages so far, still growing). Re-run it.
- **`www.inec.go.tz`** shows only 17 pages in the last recorded pass, likely a pass interrupted by a stop; run it again and compare.
- **`kenyalaw.org`**: `/legislation` is behind a login (skipped, not bypassed) and some `/kl/index.php?id=` pages return 403 (treated as a refusing section).
- **Not reached from this network**: kra.go.ke, cob.go.ke, crakenya.org, ntsa.go.ke, kenya.go.ke, gov.za, cogta.gov.za, tanzania.go.tz, www.gov.ug, www.parliament.go.ug, www.ubos.org. `www.elections.org.za` returns 403; `publicservice.go.ke` returns 500. None are in the batch.
- A slow-server pattern (nairobi.go.ke, kisumu.go.ke, ppra.go.ke, finance.go.ug) is the site, not the crawler; passes there run to the 2400 s budget and save normally.

## Open decisions for the user

1. **Disk**: 27 GB used; the 150-files-per-pass limit and the 65,000 queued files will keep filling it. Free space, add storage, set a per-site size cap, or let the guard pause the batch.
2. **Limits**: raise the 150-file and 120-page budgets so big sites finish in fewer passes?
3. **The 11 unreachable sites and the two refusing sites**: retry later or leave out.
4. **Added sites**: alidantech.org, dryv.alidantech.org and faidibiz.com are in the batch (user-owned test sites).

## Next piece of work (design only, not started)

A goal-driven job pipeline (scrape, find files, extract, stage, map) for the Kenyan constitution, with every Kenya fact in manifests only. The design answer given to the user lists the manifest kinds (`job`, `segmenter`, `expectations`), the mapping to `legal.Instruments/InstrumentVersions/Provisions/ProvisionVersions`, and four questions (authoritative source, scope, staging store, reviewer). `source/schema/contracts/targets.json` is stale against the current Dryv legal contract and must be regenerated first. Waiting on the user's answers.

## Rules the next session must keep

- Never delete `.dev/websites` content or MongoDB data unless the user says so.
- Respect `robots.txt` and refusals; never bypass a block, login or captcha.
- Commit and push fixes to `develop` as they are made; track work through `task` (`TSK-285C22DD5D24`).
