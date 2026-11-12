---
{id: DOC-DRYV-RUN-GUIDE,name: Running Dryv in this repository,type: documentation,tags: [dryv,api,agents]}
---

# Running Dryv

Use the repository root commands. `bun run dryv:check` validates contracts; `bun run dryv:generate` runs the authored generation chain; `bun run dryv:verify` checks committed output. `scripts/README.md` documents environment setup and the root runner starts/stops the engine when needed. Do not hard-code a personal Dryv checkout path or run generated tools from a different repository.

After changing contracts, run the relevant root Dryv check, inspect the generated diff and keep handwritten service implementations aligned. Generated API output is changed only through the Dryv generation workflow.
