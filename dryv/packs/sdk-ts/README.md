# Shared Next API Bridge client

This pack generates `source/sdk/api-ts` from the API activation. DefyTickets' `server/` corresponds to Mzizi's `src/`. There are no version modules or compatibility shims.

```text
src/
  index.ts
  routes.ts
  actions/
    index.ts
    <resource>.actions.ts
  helpers/
    index.ts
    api.ts
    helpers.ts
    enum.ts
  types/
    index.ts
    <resource>/
      index.ts
      dto/
        index.ts
        <schema>.ts
      enums/
        index.ts
        <enum>.ts
```

Each action module holds all operations of one API group/resource. Action names include the group to prevent collisions between groups exposing the same operation; for example `explorerGetExplorerContext` and `governanceGetInstitution`. Transport input aliases use `ExplorerGetExplorerContextActionInput`, distinguishing them from generated body schemas.

Import requests explicitly from `@mzizi/api-client/actions` or `@mzizi/api-client/actions/explorer`. Import client-safe routes and named types from the package root or its `routes` and `types` entry points. The public root exports neither actions nor server runtime helpers. `routes.ts` is the single endpoint registry; dynamic identities are encoded. `helpers/api.ts` initializes next-api-bridge with `SERVER_URL` and existing bridge settings.

The resource, DTO and enum indexes re-export their real generated modules. They are primary entry points, not legacy aliases. There are no per-operation action directories, router directories, flat duplicate modules, compatibility wrappers, generated UI or test directories. Only populated schema categories are emitted. The generated package has a `typecheck` script for the root quality runner.

Change contracts or this pack rather than generated files. Dryv's receipt retires obsolete managed outputs. Existing frontend consumers must migrate their imports in their own work; this checkpoint deliberately does not preserve former per-operation imports or the old frontend assembly binding.
