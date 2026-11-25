# Mzizi API Features (Dryv-Generated)

Complete feature implementation status and adoption roadmap.

## ✅ Completed Features

### 1. Typed Persistence (NestJS + PostgreSQL)

**What it does:**
- Generated repository functions with full type safety
- Nested reads with counts, paging, and missing-result failures
- Transactional writes with typed failures
- SQL generation from contracts

**How it's used:**
- Each module exposes use cases (GetMyAccount, ListAccounts)
- Use cases inject PersistenceRuntime
- Runtime executes typed plans with PostgreSQL

**Files:**
- `source/backend/api/src/database/persistence/` — runtime and type definitions
- `source/backend/api/src/modules/*/features/*/use-cases/` — repositories and config

**Next:** Full write operations across all modules

---

### 2. Redis Caching with TTL and Invalidation

**What it does:**
- Automatic cache for all read operations
- Environment-specific cache prefixes (dev/staging/prod)
- TTL-based expiry (reference: 6h, structure: 1h, figures: 30min, live: 60s)
- Operation generation bumping on write (all variants invalidate atomically)

**How it's used:**
- Operations declare `.cache(CACHE.reference)` or `.cache(CACHE.structure)` etc
- Write operations declare `.invalidates([...operations...])` (future)
- Cache key includes: operation, generation, store, all inputs, principal, policies

**Configuration:**
- `REDIS_URL` environment variable (optional; falls back to no cache)
- Cache prefix: `mzizi:api:{env}:{store}` per NODE_ENV
- Break cache: update prefix in `database.module.ts` + redeploy

**Files:**
- `source/backend/api/src/database/database.module.ts` — cache setup
- `dryv/contracts/apps/api/CACHING.md` — invalidation rules
- `dryv/contracts/apps/api/reference.ts` — example cache declarations + write stubs

---

### 3. Authentication and Policy Binding

**What it does:**
- Trusted context extraction from requests
- Policy-based access control (required policies on operations)
- Scoped cache keys (principal + policies affect cache identity)
- Never bind TrustedContext from HTTP input

**How it's used:**
- Operations declare `.authenticated()` or `.require("#/policies/auth.PlatformAdmin")`
- PersistencePolicyResolver returns { principal, policies: Map }
- Runtime denies operations that require missing policies

**Current state:**
- `AuthPolicyResolver` placeholder (ready for real auth)
- Anonymous access works (principal=null, policies={})
- Example: `UpdateCountry` requires `auth.PlatformAdmin` policy

**Files:**
- `source/backend/api/src/database/auth-policy.resolver.ts` — resolver framework
- `dryv/contracts/apps/api/_shared.ts` — failure profile

**Next:** Wire real authentication (OAuth2, JWT, OIDC, etc.)

---

### 4. Shared Response Schemas

**What it does:**
- Nested structures across operations
- Localization (LocalizedText with language fallback)
- Keyed maps and GeoJSON support
- Consistent across TypeScript and Dart SDKs

**How it's used:**
- All displayed text becomes LocalizedText { text, language, isFallback, direction }
- Reference module returns all names in every identity field
- Frontend assembles screens by localizing responses

**Files:**
- `dryv/contracts/apps/api/_shared.ts` — LocalizedText, shared shapes
- `dryv/contracts/apps/api/reference.ts` — namesOf() helper example

---

### 5. Invalidation Framework (Ready for Writes)

**What it does:**
- Documents what reads each write operation invalidates
- Prevents stale cache after updates
- Automatic cache generation bumping after commit

**Current state:**
- Read operations annotated with invalidation rules (comments)
- CACHING.md maps all cached reads and future writes
- Example write: UpdateCountry (shows `.invalidates()` structure)

**Usage when writes are added:**
```typescript
UpdateCountry: dryv
  .operation()
  .mutation(/* ... */)
  .invalidates([
    "#/operations/reference.ListCountries",
    "#/operations/reference.GetCountry",
  ])
```

**Files:**
- `dryv/contracts/apps/api/CACHING.md` — full invalidation map
- `dryv/contracts/apps/api/reference.ts` — read annotations + example write

---

## 🟡 In Progress

### 1. Write Operations with Full Mutations

**Current state:**
- Example `UpdateCountry` stub shows structure
- Needs actual mutation definitions (SQL insert/update/delete)
- Needs input schemas and return types

**Next steps:**
1. Add full mutation logic to example
2. Replicate pattern across all modules
3. Add database migrations
4. Regenerate contracts

**Scope:** All modules (reference, identity, geography, etc.)

---

### 2. Durable Execution (Framework Ready)

**What it does:**
- Atomic mutation + outbox in one transaction
- Event emission with guaranteed delivery (PostgreSQL + Redis Streams)
- Retries with exponential backoff
- Recovery through PostgreSQL logs
- Nested workflows and parallel joins

**Current state:**
- `ExecutionModule` placeholder (disabled by default)
- Ready for activation when EXECUTION_ENABLED=true

**Next steps:**
1. Create execution infrastructure tables
2. Migrate database
3. Register ExecutionModule
4. Wire up worker process
5. Declare operations with `execution()` metadata

**Files:**
- `source/backend/api/src/database/execution.module.ts` — framework

---

### 3. Multi-Store Support

**Current state:**
- Only `main` store configured
- Ready to add: operations, audit logs, analytics stores

**Next steps:**
1. Configure additional stores in `dryv.yaml`
2. Add store-specific cache prefixes
3. Declare operations on other stores

---

## 📋 Adoption Checklist

- [x] Typed persistence runtime (NestJS + PostgreSQL)
- [x] Redis caching with TTL (reference/structure/figures/live)
- [x] Environment-specific cache prefixes (dev/staging/prod)
- [x] Cache invalidation framework documented
- [x] Authentication resolver framework
- [x] Policy-based access control structure
- [x] Shared response schemas (LocalizedText)
- [x] Example write operation with `.invalidates()`
- [ ] Real authentication implementation (OAuth2/JWT/OIDC)
- [ ] Full write operations across all modules
- [ ] Database migrations for new tables
- [ ] Durable execution activation
- [ ] Worker process for durability
- [ ] Multi-store configuration
- [ ] Regenerate all contracts

---

## Running Dryv Generation

When contracts are ready:

```bash
# Check contracts
bun run dryv:check

# Plan output (dry-run)
bun run dryv:generate --dry-run

# Generate (write to disk)
bun run dryv:generate

# Full check (contracts + database + builds)
bun run check:all
```

---

## Environment Variables

| Variable | Purpose | Required | Default |
|----------|---------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection | Yes | — |
| `REDIS_URL` | Redis for caching | No | No cache |
| `NODE_ENV` | Cache prefix isolation | No | `dev` |
| `EXECUTION_ENABLED` | Durable execution | No | `false` |

---

## Next Session Tasks

1. Implement real authentication in AuthPolicyResolver
2. Add full write mutations to reference operations
3. Extend write operations to other modules (identity, geography, etc.)
4. Run Dryv generation with updated contracts
5. Set up durable execution infrastructure
