# API Caching and Invalidation

Mzizi API uses Redis caching with scoped keys and TTL-based expiry. This document tracks cache declarations and invalidation dependencies for all operations.

## Cache Configuration

**Environment-specific prefixes:**
- `mzizi:api:dev:main` (development)
- `mzizi:api:staging:main` (staging)
- `mzizi:api:prod:main` (production)

**TTL levels** (from `_shared.ts`):
- `reference` (6h): Countries, languages, vocabularies — change with releases
- `structure` (1h): Places, institutions — change with data loads
- `figures` (30min): Results, money — change with updates/refreshes
- `live` (60s): Contributions, counts — change continuously

## Declared Operations

### Reading Operations (cached, never stale past TTL)

| Module | Operation | Cache | Invalidated by | Notes |
|--------|-----------|-------|----------------|-------|
| reference | ListCountries | reference | (future: UpdateCountry, BulkUpdateCountries) | 6h TTL |
| reference | GetCountry | reference | (future: UpdateCountry) | 6h TTL |
| reference | ListLanguages | reference | (future: UpdateLanguage) | 6h TTL |
| reference | ListHierarchies | reference | (future: BulkUpdateHierarchies) | 6h TTL |
| reference | ListUnits | reference | (future: UpdateUnit) | 6h TTL |
| reference | ListCurrencies | reference | (future: UpdateCurrency) | 6h TTL |
| identity | (all reads) | structure | (future: writes to identity module) | 1h TTL |
| geography | (all reads) | structure | (future: writes to geography module) | 1h TTL |
| statistics | (all reads) | figures | (future: writes to statistics module) | 30min TTL |

### Writing Operations (future)

When write operations are added to the API, they must declare `.invalidates()` with:

```typescript
YourWriteOperation: dryv
  .operation()
  .role("create|update|delete")
  .input(YourInput)
  .output(YourOutput)
  .mutation(/* ... */)
  .invalidates([
    "#/operations/reference.ListCountries",
    "#/operations/reference.GetCountry",
    // ... other affected reads
  ])
  .facets(/* ... */),
```

## Invalidation Rules

**Reference data** (6h TTL):
- Any update to countries, languages, hierarchies, units, or currencies must invalidate all list and detail operations
- Example: `UpdateCountry` → invalidates `ListCountries`, `GetCountry`

**Structural data** (1h TTL):
- Any write to places, institutions, identity must invalidate reads in those modules
- Cascade invalidation if relationships cross modules

**Live data** (60s TTL):
- Contributions and counts invalidate on write (auto-stale within 60s anyway)

## Cache Key Composition

```
${PREFIX}:${operation}:${generation}:${hash(input + principal + policies)}
```

- **operation**: Full operation ID (`#/operations/module.Operation`)
- **generation**: Incremented after every write that invalidates this operation
- **input**: Hashed with principal and all trusted policy values
- **Environment**: Prefix changes with NODE_ENV (dev/staging/prod)

When deployed with breaking API changes:
1. Update `cachePrefix()` in `database.module.ts`
2. Redeploy
3. Old entries in Redis expire naturally; new requests hit fresh code

## Missing Pieces

- [ ] Real authentication (currently AnonymousPolicyResolver)
- [ ] Write operations with `.invalidates()` declarations
- [ ] Durable execution for background writes
- [ ] Multi-store caching (currently main store only)
