<!-- dryv:begin -->
# Dryv agent instructions

Read [README.md](README.md), [the skills index](agents/README.md), and [project configuration](../dryv.yaml). Repository-wide instructions still apply.

Canonical Runtime IR is the semantic authority. Change authored inputs or packs and inspect a generation preview before applying output. Clients own filesystem and environment operations; Template Servers only analyze and render syntax. Preserve explicit source and destination paths.

Use dryv validate, dryv plan, and dryv generate --dry-run to inspect changes. Use --json --no-input for automation. Trust author compilers and actions only within the user's authorized scope; never infer permission from this guide. See dryv docs errors for diagnostics.

Load the project, authoring, or pack skill only for the corresponding task. These are portable local resources linked here; they are not automatically installed into an AI tool.

## Configured authoring sources

| Name | Type | Project-relative path | Entrypoint |
| --- | --- | --- | --- |
| pgsql | typescript | dryv/contracts | apps/pgsql/index.ts |
| api | typescript | dryv/contracts | apps/api/index.ts |
| engine | typescript | dryv/contracts | apps/engine/index.ts |
<!-- dryv:end -->
