---
{id: DOC-790EA0CE56D5,name: Coding Rules,type: documentation}
---

# Coding Rules

- Follow root `AGENTS.md` and the relevant `.docs` architecture/domain contract first.
- Preserve service ownership: public API is NestJS target; current Python FastAPI is migration input; extraction, intelligence, files, and database lifecycle remain separate responsibilities.
- Keep canonical domain rules out of presentation components. Apps consume versioned API contracts.
- Model provenance, source artifact, retrieval time, historical validity, uncertainty, verification, and version history where applicable.
- Use stable backend IDs and explicit parent relationships; never derive identity from a name, coordinate, or display label.
- Keep secrets out of source and mobile bundles. Avoid committing `.env.local`, credentials, generated output, local databases, or dependency folders.
- Make errors and unavailable data explicit. Do not substitute unverified geometry or fabricated records.
- Prefer small changes that preserve existing behavior and document architecture/data lifecycle changes in `.docs`.
- Run everything from the repository root with the Bun runner (`scripts/README.md`). Python projects use uv; JavaScript and TypeScript projects use Bun. Do not add another package manager or a per-project task runner.
- Hand-written code must pass `bun run check`: formatted (ruff, Biome, Prettier), linted, fully type annotated (mypy, strict `tsc`) and within the hard file size and layout limits of `bun run structure`. Every source file opens with a docstring or comment that says what it is for. Split a file by responsibility when it reaches its limit; never raise the limit to fit it.
- Generated output stays connected through Dryv: change the contracts and run `bun run dryv:generate`; never hand-edit or reformat Dryv-managed files.
- Typed contracts, a single parsing boundary, no hard-coded classification (data lives in manifests) and centralised pattern matching apply to all Python, Rust and TypeScript code: see [typed-code.md](typed-code.md).
