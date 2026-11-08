# mzizi-source

Polite source client: identified fetching, limits, challenge handling and the collection-gate rule.

Loading assessments from a database is the caller's job; the gate here is a pure function tested with `seed/fixtures/contracts/gate-vectors.json`.

See [../README.md](../README.md) for the package map and workspace commands. Tests: `uv run pytest source/packages/source`.
