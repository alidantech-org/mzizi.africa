---
{id: DOC-0EB3FF9D6D34,name: Security Rules,type: documentation}
---

# Security Rules

- Never commit secrets, access tokens, production credentials, private keys, or user data. Local env files remain ignored.
- Treat mobile compile-time configuration as public. Restrict public vendor tokens at their provider; never put backend secrets in the app.
- Use HTTPS outside local development. Keep CORS origins narrow and use the existing authentication model when the API contract defines it.
- Validate and bound user input, result counts, pagination, and geometry payload size.
- Do not log credentials or sensitive source contents. Preserve access controls for source artifacts and research workflows.
- AI/tool output is untrusted candidate material and must remain attributable and reviewable before canonical promotion.
