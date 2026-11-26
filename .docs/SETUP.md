---
id: DOC-SETUP
name: Setup
type: documentation
---

# SETUP.md: clone, install and scrape any site

This guide takes a fresh clone to a working scrape-and-extract job: crawl a site (including JavaScript-heavy sites and pages with bad HTML), follow pagination, download every PDF, then extract each PDF into Markdown, tables (CSV), images and OCR text.

You only need the **Python engine path** below. The API, dashboards and mobile app are separate and not needed to scrape.

## 1. What you need installed

| Tool | Why | Required |
| --- | --- | --- |
| **Git** | clone the repository | yes |
| **Python 3.12+** | the engine and its packages | yes (uv can install it for you) |
| **uv** | Python package and environment manager | yes |
| **Docker** | runs MongoDB, which tracks the download queue and run log | yes (or a MongoDB you already have) |
| **Tesseract OCR** (+ language data) | reads scanned PDFs | yes for scanned PDFs |
| **Playwright Chromium** | renders JavaScript-heavy sites | yes for `render: auto` or `browser` |
| Bun | root runner for the API and dashboards | no (not needed for scraping) |

Disk: allow several GB. Browsers, downloaded PDFs and extracted images add up.

### Linux

Fedora:

```bash
sudo dnf install -y git python3.12 docker tesseract tesseract-langpack-eng tesseract-langpack-swa
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"   # log out and in once
```

Ubuntu or Debian:

```bash
sudo apt update
sudo apt install -y git python3 docker.io tesseract-ocr tesseract-ocr-eng tesseract-ocr-swa
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"   # log out and in once
```

For other scan languages add `tesseract-ocr-<code>` (apt) or `tesseract-langpack-<code>` (dnf), for example `fra`, `ara`, `amh`.

### macOS

```bash
xcode-select --install
brew install git tesseract tesseract-lang
brew install --cask docker     # then open Docker Desktop once
```

`tesseract-lang` installs every language pack.

### Windows

Use **WSL2** with Ubuntu: run `wsl --install -d Ubuntu` in PowerShell, restart, install Docker Desktop with the WSL2 backend enabled, then follow the Ubuntu steps above **inside the Ubuntu shell**. Clone the project inside the WSL filesystem (`~/projects`), not under `/mnt/c`, so file watching and speed are normal.

### uv (all systems)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh     # macOS, Linux, WSL
```

Open a new shell afterwards, then check `uv --version`.

## 2. Clone and install

```bash
git clone <repository-url> mzizi.africa
cd mzizi.africa
git checkout develop
uv sync --all-packages          # creates .venv and installs every engine package
uv run playwright install chromium
```

If Chromium complains about missing system libraries on Linux, run `uv run playwright install-deps chromium`.

## 3. Start MongoDB and configure

```bash
docker run -d --name mongodb --restart unless-stopped -p 127.0.0.1:27017:27017 mongo:7
cp .env.example .env
```

In `.env` the defaults already work for scraping: `MZIZI_MONGO_URL=mongodb://127.0.0.1:27017`, `MZIZI_MONGO_DATABASE=mzizi`, `ENGINE_RUN_STORE=local`. Set `MZIZI_USER_AGENT` to something that identifies you with a contact address. Sites see it.

The database URL and S3 settings in `.env.example` are for the full platform. A scrape does not use them.

## 4. Check everything works

```bash
tesseract --version && tesseract --list-langs     # shows eng (and swa if installed)
uv run --no-sync mzizi-engine check               # settings are valid
uv run --no-sync mzizi-engine capabilities | grep -E '"name": "(site.watch|extraction.folder)"'
docker ps --filter name=mongodb                   # MongoDB is up
```

## 5. Set up a job for a site

A job is one JSON file. Start from the example and copy it **outside version control** (`.dev/` is git-ignored):

```bash
mkdir -p .dev/jobs
cp source/schema/engine/_example/documents-job.json .dev/jobs/mysite.json
```

Edit these fields:

| Field | What to put |
| --- | --- |
| `name`, `code` | any label; `code` is dotted lowercase, like `sys.eng.job.ke.mysite` |
| `sources[0].url` | the site's start page |
| `sources[0].authority_ref` | a label for your permission or source record (any text locally) |
| `stages[0].params.url` | the same start page |
| `stages[0].params.out_dir` | where this run writes (for example `.dev/runs/mysite`) |
| `stages[1].params.source` | the folder the crawl saves PDFs in (see below) |
| `stages[1].params.out_dir` | where the extracted documents go |
| `stages[1].params.languages` | OCR languages, for example `eng` or `eng+swa` |

### The two stages

1. **`site.watch`** crawls, follows pagination, hunts for files and downloads them.

   | Parameter | Meaning |
   | --- | --- |
   | `render` | `http` (fast, plain pages), `browser` (always a real browser), `auto` (HTTP, browser only for pages that need one). Use `auto` for unknown sites |
   | `max_pages`, `max_depth` | how far the crawl goes |
   | `max_list_pages` | pages followed inside each paginated listing |
   | `delay` | seconds between requests. Be polite: 1 or more |
   | `max_seconds` | time budget for one pass; the crawl saves everything and stops cleanly |
   | `passes` | repeat the crawl up to this many times while new pages keep appearing. Each pass resumes from saved copies |
   | `min_age_hours` | a page fetched more recently than this is not fetched again |
   | `download_limit` | files fetched per run |
   | `download_kinds` | `["document","candidate"]` downloads documents only (PDF, Word, Excel); add `image`, `media`, `file` to get those too |
   | `robots_mode` | `respect` by default. See "Responsible use" |

2. **`extraction.folder`** turns each downloaded PDF into a folder of Markdown, structure, tables and images.

   | Parameter | Meaning |
   | --- | --- |
   | `source` | the PDF folder from stage 1 |
   | `ocr` | `true` reads scanned pages with Tesseract |
   | `languages` | Tesseract languages joined with `+` |
   | `limit` | at most this many new files per run (`0` is no limit) |

### Where the PDFs land

The crawl stores a site under `.dev/websites/<tld>/<domain>/<name>/_root/`. For `orpp.or.ke` that is `.dev/websites/ke/or/orpp/_root/`, and its PDFs are in `scraped/files/pdf`. After the first run the stage prints the exact `site` path. Put `<site>/scraped/files/pdf` into `stages[1].params.source`. To discover it before the first run, run only stage 1 (delete the second stage temporarily), read the printed `site`, then add the stage back.

## 6. Run the job

```bash
uv run --no-sync mzizi-engine run-job .dev/jobs/mysite.json
```

It runs in your terminal. Failures to fetch single pages (for example a 404 on a broken link) are printed as `block ...` lines and do not stop the run. At the end each stage prints a summary:

- crawl: `pages_visited`, `new`, `files_hunted`, `files_downloaded`, `complete`, `stopped`
- extraction: `extracted`, `skipped`, `failed`

If the crawl reports `complete: False` with `stopped: time budget ...`, run the **same command again**. It resumes from saved pages and downloads and only does new work. Raise `max_pages`, `max_seconds` or `passes` for big sites.

## 7. What you get

```text
.dev/websites/<...>/_root/
    pages/ scraped/               every page as hashed, versioned HTML + Markdown
    scraped/files/pdf/            the downloaded PDFs (original bytes, never altered)
.dev/runs/<out_dir>/
    documents.csv links.csv       inventory of files and links found
    text/<pdf-name>/
        document.md               the whole PDF as formatted Markdown
        structure.json            every page and block with positions
        tables/page-N-table-M.csv one CSV per table
        tables/...alt-*.csv       other readings of tables that looked weak
        assets/                   images and diagrams cropped from pages
        report.json              diagnostics, OCR confidence, table review notes
```

Tables in `document.md` link to their CSV files. A table that looked unreliable also links to alternative CSVs from other detectors; compare them and keep the best.

Extraction is safe to repeat: unchanged PDFs are skipped by their SHA-256 hash.

## 8. Run only extraction on PDFs you already have

```bash
uv run --no-sync python - <<'PY'
from mzizi_extraction.folder import FolderRequest, extract_folder
r = extract_folder(FolderRequest(source="path/to/pdfs", out_dir=".dev/runs/my-text", ocr=True, languages="eng"))
print(r.extracted, r.skipped, r.failed)
PY
```

Or extract one file: `uv run --no-sync mzizi extract pdf path/to/file.pdf`.

## 9. Heavy JavaScript sites and bad HTML

- Use `"render": "auto"`; the crawl switches to Chromium for pages that need scripts, scrolling, "load more" or next-button pagination.
- If a site hides content until a browser profile or login exists, that needs approved access. See the policy docs below.
- Malformed HTML is parsed leniently. Pages are saved raw first and converted afterwards, so a conversion problem never loses the source.
- Query-string traps (endless search URLs) are limited by the engine, so a site with a search form cannot run the crawl forever.

## 10. Responsible use

The engine records `robots.txt` as a signal and respects it by default. Do not scrape sites you have no right to use, keep `delay` polite, identify yourself in `MZIZI_USER_AGENT`, and keep each job scoped to the site you intend. Overrides and CAPTCHA handling need a recorded authorisation and rationale. Read `.docs/design/policy/LEGALITY_SAFETY_AND_COMPLIANCE.md` and `.docs/rules/security.md` before using them.

## 11. Troubleshooting

| Symptom | Fix |
| --- | --- |
| `the download queue needs the MongoDB activity store` | start MongoDB (`docker start mongodb`) and check `MZIZI_MONGO_URL` |
| `Phase-one runs require ENGINE_RUN_STORE=local` | set `ENGINE_RUN_STORE=local` in `.env` |
| `ConfigError ... MZIZI_...` | compare `.env` with `.env.example`; run `mzizi-engine check` |
| OCR says Tesseract or a language is missing | install the packages from section 1 and check `tesseract --list-langs` |
| Browser fails to start | `uv run playwright install chromium`, then `playwright install-deps chromium` on Linux |
| Few pages found on a JS site | use `render: auto` or `browser`, and raise `max_depth` and `max_list_pages` |
| Crawl stops early | read `stopped` in the summary and rerun; raise `max_seconds` or `passes` |
| `Operation ... is outside phase-one spec execution` | only `scraping.crawl`, `site.watch` and `extraction.folder` run from specs |

## 12. More reading

- [CLI and engine jobs quickstart](design/operations/cli-and-jobs.md)
- [Web acquisition runtime](design/acquisition/WEB_ACQUISITION_RUNTIME.md)
- [Extraction package](../source/packages/extraction/README.md)
- [Job spec schema](../source/schema/engine/job.schema.json) and [example](../source/schema/engine/_example/documents-job.json)
- [Engine README](../source/backend/engine/README.md)
