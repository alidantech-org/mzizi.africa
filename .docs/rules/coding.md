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
