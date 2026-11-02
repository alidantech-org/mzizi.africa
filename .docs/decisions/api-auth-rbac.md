---
{id: DEC-API-AUTH-RBAC,name: Decision - API authentication and RBAC,type: decision,tags: [api,security]}
---

# Decision: API authentication and RBAC

Date: 2026-11-02.

## Decision

The NestJS API validates bearer JWTs issued by a configurable OIDC-compatible issuer; it does not issue credentials or store passwords. Roles come from a `roles` claim: `reader` (anonymous and public access to read endpoints), `contributor` (comments and evidence references), `reviewer` (review decisions) and `admin` (administrative updates). Guards are generated or hand-written per endpoint and default to deny.

## Why

Identity issuance is not a Mzizi domain responsibility, and building it would add credential handling to a read-mostly API. A claim-based role check keeps the provider replaceable, and the choice can be revisited without changing contracts, since contracts only name required roles.

## Consequences

Every write endpoint records the actor identifier and role. Local development uses a test issuer with test keys only.
