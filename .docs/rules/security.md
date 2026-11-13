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

## Browser-based research collection

- Browser automation, alternative browser adapters and anti-bot-resilient browsing are permitted engineering capabilities for sources with an approved collection basis; the choice of adapter alone is not a reason to reject work.
- `robots.txt` is a source preference and recorded policy input. Default to respecting it, but allow an explicitly approved, source-scoped override with recorded justification and reviewer/authority. Do not hard-code a universal prohibition or a universal override.
- Support detecting CAPTCHAs and other challenges, and designing authorised resolution flows including human participation and approved provider integrations. Restrict live use to the access scope recorded for that source.
- Record method, source authorisation, client configuration, request volume, challenge outcomes and failures without exposing secrets. Enforce reasonable request budgets and avoid disruption, unauthorised account access, credential misuse and vulnerability exploitation.
- If a method is outside approved source scope, report the specific gate and preserve the rest of the research workflow; do not silently reinterpret source approval.
