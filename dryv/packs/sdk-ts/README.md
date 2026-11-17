# Next API Bridge pack

Generates Next.js **server actions** over [`next-api-bridge`](https://www.npmjs.com/package/next-api-bridge) for every HTTP operation. This is the Dryv version of the old CodepotG Next.js generator.

| IR | Generated |
| --- | --- |
| operation with an HTTP facet | `actions/<group>/<operation>.actions.ts` (`'use server'`): `<operation>(input)` and `<Operation>Input` |
| `create` / `update` operation with a body | also `<operation>Action`, a `useActionState` form action |
| operations of a group | `routes/<group>.ts`: `<group>Routes`, strings for static paths and typed functions for parameterised ones (`routes/index.ts` barrel) |
| schema | `types/<schema>.ts` interface |
| enum | `types/enums/<enum>.ts` |

Support files: `helpers/api.ts` (the server-only bridge client), `helpers/helpers.ts` (`ActionInput`, `requestOptions`, form-data cleaning) and `helpers/enum.ts`.

## Calling convention (`operation.client`)

Every action takes `{ params?, query?, body?, options? }` (via `ActionInput<Params, Query, Body>`, which makes `params` and `body` required when the operation has them) and resolves to `next-api-bridge`'s `ApiBridgeResponse<T>`: `{ success, message, body, status, … }`. `frontend/nextjs-app` binds to this slot.

## Form actions

```tsx
const [state, action, pending] = useActionState(createUserAction, null);
<form action={action}>
  <input name="displayName" />
  <input type="hidden" name="__redirect_path" value="/users" />
</form>
```

Reserved fields start with `__` and never reach the API: `__redirect_path`, `__delete[:field]`, `__json_parse[:field]`, `__boolean[:field]`, `__number[:field]`, `__date[:field]` and `__path:<param>`.

## Configuration

`SERVER_URL` (or `NEXT_PUBLIC_API_URL`), `API_COOKIE_PREFIX`, `SERVER_APP_API_KEY`, `SERVER_APP_API_KEY_HEADER_KEY` and `ENABLE_VERBOSE_LOGGING`. Requires `next-api-bridge` ^0.1.10 and `server-only`.

**Test:** `bun scripts/test-pack.ts unit/clients/next-api-bridge` typechecks against the real `next` and `next-api-bridge`, then runs the actions, routes and a form action with the bridge's network client mocked.

## Use it

The [executable Usage fixture](tests/fixture/dryv.yaml) shows the current source collection, destination and pack activation for this pack.

## Slots

- provides `operation.client`
- provides `schema.types`
- provides `property.enum.types`
