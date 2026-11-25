# Mzizi Africa Bun Monorepo

Unified Bun workspace managing Dryv contracts, backend API, and web applications from a single root.

## Structure

```
mzizi.africa/                          # Repository root
├── package.json                       # Root workspace definition
├── bun.lock                           # Unified dependency lock
├── scripts/
│   ├── mz.ts                          # Command router (all commands delegate here)
│   ├── lib/                           # Shared utilities
│   └── README.md                      # Command documentation
│
├── dryv/                              # Dryv workspace
│   ├── package.json                   # Dryv workspace (contracts, auth, packs)
│   ├── contracts/
│   │   ├── apps/
│   │   │   ├── api/                   # API operation contracts
│   │   │   ├── engine/                # Engine operation contracts
│   │   │   └── pgsql/                 # Database schema contracts
│   │   └── schemas/                   # Shared domain models
│   ├── packs/                         # Code generation packs
│   ├── tools/                         # Dryv utilities
│   └── AGENTS.md                      # Dryv-specific guidance
│
└── source/                            # Backend & frontend workspace
    ├── package.json                   # Source workspace (SDK, apps, backend)
    ├── bun.lock                       # Workspace lock (synced from root)
    │
    ├── sdk/                           # Generated and hand-written SDKs
    │   ├── api-ts/                    # TypeScript API client (generated)
    │   ├── engine-ts/                 # Engine client (generated)
    │   ├── ui/web/                    # Web UI components
    │   └── copy/                      # Cross-workspace shared utilities
    │
    ├── apps/                          # Web applications
    │   ├── web/                       # Next.js web app (review workbench)
    │   ├── dev/                       # Admin interface (temporary)
    │   └── www/                       # Public marketing site
    │
    ├── backend/                       # Backend services
    │   ├── api/                       # NestJS product API
    │   ├── database/                  # Bun CLI, migrations, SQL
    │   └── engine/                    # Python runtime
    │
    ├── packages/                      # Reusable Python libraries
    │   ├── browser/                   # Playwright & browser adapters
    │   ├── cli/                       # CLI interfaces
    │   ├── crawler/                   # Web scraping
    │   ├── extraction/                # Data extraction
    │   ├── fetch/                     # HTTP client
    │   ├── filesystem/                # File system operations
    │   ├── manifest/                  # Site manifests
    │   ├── search/                    # Search integration
    │   └── ...more packages           # Other capabilities
    │
    └── schema/                        # Input and exchange schemas
        ├── database/                  # Database input contracts
        ├── engine/                    # Engine input/output contracts
        ├── sources/                   # Source input specifications
        └── codes.json                 # Global code registry
```

## Bun Workspace Hierarchy

```
Root (package.json)
├── dryv/                   # Dryv contracts & code generation
│   └── Contracts only (no nested workspaces)
│
└── source/                 # Backend & frontend applications
    ├── sdk/api-ts/        # API client package
    ├── sdk/engine-ts/     # Engine client package
    ├── sdk/ui/web/        # UI component package
    ├── sdk/copy/          # Shared utilities package
    ├── apps/web/          # Web app
    ├── apps/dev/          # Admin app
    ├── apps/www/          # Marketing site
    └── ...more workspaces # Backend services
```

## Dependency Lock File

**Single unified `bun.lock` at root:**
- Covers all dryv and source dependencies
- When source/ modifies dependencies, it updates root bun.lock
- Never commit separate bun.lock files in subdirectories

**To sync after changes:**
```bash
bun install
```

This regenerates `/bun.lock` with all workspace dependencies.

## Command Architecture

All commands route through `scripts/mz.ts`:

```bash
# User runs at root
bun run help

# Script delegates to handlers in scripts/lib/projects.ts
# Example: check → typecheck, lint, format:check, structure, etc.
bun run check
```

**Command registry:** See `scripts/README.md` for full list.

## Setup Instructions

### Initial Setup

```bash
# Install all dependencies (dryv + source workspaces)
bun install

# Optional: Link local Dryv checkout
bun run dryv:link

# Start dev environment
bun run dev
```

### Adding Dependencies

**Add to a specific workspace package (e.g., API):**
```bash
cd source/backend/api
bun add lodash
# Returns to root, root bun.lock updated
```

**Add to root (dev-only, all workspaces):**
```bash
bun add -D @biomejs/biome
```

### Running Commands

**From repository root:**
```bash
# Format all workspaces
bun run format

# Typecheck all workspaces
bun run typecheck

# Run tests
bun run test

# Check everything
bun run check
```

**Within a workspace (optional, not recommended):**
```bash
# Not recommended - use root commands instead
cd source/apps/web && bun run dev
# Better approach:
bun run dev:web  # From root
```

## Workspace-Specific Commands

### Dryv

```bash
bun run dryv:check         # Validate contracts
bun run dryv:generate      # Generate from contracts
bun run dryv:api           # Run Dryv engine API
bun run dryv:api:stop      # Stop Dryv engine
bun run dryv:link          # Link local Dryv checkout
```

### Source (SDK + Apps + Backend)

```bash
# Development servers
bun run dev              # All dev servers
bun run dev:web         # Web app only
bun run dev:api         # API only
bun run dev:engine      # Engine only

# Building
bun run build           # Build all apps

# Quality gates
bun run typecheck       # All packages
bun run lint            # All packages
bun run format          # All packages
bun run test            # All packages
```

### Backend

```bash
bun run db:up           # Start database
bun run db:down         # Stop database
bun run infra:up        # Start all infrastructure
bun run infra:down      # Stop all infrastructure
```

## Environment Setup

### Environment Variables

Create `.env.local` at repository root (not committed):

```bash
# PostgreSQL
DATABASE_URL=postgresql://...

# Redis
REDIS_URL=redis://...

# Node environment
NODE_ENV=dev|staging|prod

# Dryv (optional)
DRYV_HOME=/path/to/local/dryv
DRYV_API_PORT=8750

# Execution (future)
EXECUTION_ENABLED=false
```

### Local Development

```bash
# 1. Setup workspace
bun install

# 2. Start infrastructure
bun run infra:up

# 3. Run dev environment
bun run dev

# Services start on:
# - API: http://localhost:3400
# - Web: http://localhost:3300
# - Dryv API: http://localhost:8750 (if enabled)
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
```

## Monorepo Best Practices

### Do ✅

- **Run all commands from root:** `bun run check`, `bun run dev`
- **Use workspace paths:** `source/apps/web/src`, `dryv/contracts/apps/api`
- **Keep lock file at root:** Unified dependency management
- **Add dependencies via root:** `bun add` from repository root or cd then return
- **Reference workspace commands:** See `scripts/README.md`

### Don't ❌

- **Don't have separate bun.lock files:** One unified lock at root only
- **Don't install separately:** Always `bun install` from root
- **Don't run commands from subdirectories:** Always delegate through `scripts/mz.ts`
- **Don't modify workspace configuration:** Centralize all setup
- **Don't commit node_modules:** Bun handles all dependencies

## Rebuilding the Lock File

If `bun.lock` becomes corrupted or out of sync:

```bash
# Remove lock and reinstall
rm bun.lock
bun install

# This regenerates bun.lock with all workspace dependencies
```

## CI/CD Integration

**GitHub Actions, GitLab CI, or similar:**

```yaml
# Single install command for all workspaces
install:
  - bun install

# Commands work across all workspaces
test:
  - bun run check
  - bun run test

# Deploy uses commands from scripts/mz.ts
deploy:
  - bun run build
  - bun run dryv:generate  # If needed
```

## Scaling to Multiple Services

The monorepo scales by adding workspaces:

```json
{
  "workspaces": [
    "dryv",           # Contracts
    "source",         # Backend + frontend
    "operations",     # (Future) Ops scripts
    "infrastructure", # (Future) Infrastructure as code
    "documentation"   # (Future) Docs site
  ]
}
```

Each workspace has its own `package.json` and dependency set, all unified in a single `bun.lock`.

## Troubleshooting

### "Command not found"

```bash
# Make sure you're at repository root
pwd  # Should end with /mzizi.africa

# Verify bun installation
bun --version

# Check scripts are accessible
bun run help
```

### Dependencies not installed

```bash
# Clean reinstall
rm bun.lock source/bun.lock
bun install
```

### Workspace not resolving

```bash
# Verify workspaces in root package.json
cat package.json | grep -A 5 workspaces

# Check dryv and source exist
ls -la dryv/ source/
```

### TypeScript errors across workspaces

```bash
# Clean build
bun run format
bun run typecheck
```

## References

- [Bun Workspaces Documentation](https://bun.sh/docs/cli/bunx#workspaces)
- `scripts/README.md` — Full command reference
- `dryv/AGENTS.md` — Dryv-specific guidance
- `.docs/` — Project documentation
