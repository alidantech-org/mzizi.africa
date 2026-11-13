"""`mzizi`: the developer CLI that exercises engine capabilities on local files and URLs.

The CLI builds payloads and calls registered capability handlers; it holds no extraction, scraping or fetching logic.
Planned work is declared as ports (`ports.py`) and commands (`catalog.py`); a command whose capability is not yet
registered explains why and exits with a distinct code. See `.docs/_plan/mzizi-engine/`.
"""
