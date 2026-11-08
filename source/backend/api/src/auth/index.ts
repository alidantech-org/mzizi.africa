import type { INestApplication } from "@nestjs/common";

import { ActorInterceptor } from "#/auth/actor.interceptor";
import { AuthGuard } from "#/auth/auth.guard";
import { DatabaseAuthGuard } from "#/auth/database-auth.guard";
import type { AccessAuthority } from "#/auth/authority";
import type { TokenVerifier, VerifiedToken } from "#/auth/token-verifier";

export * from "#/auth/actor-context";
export * from "#/auth/actor.interceptor";
export * from "#/auth/auth.guard";
export * from "#/auth/authority";
export * from "#/auth/database-auth.guard";
export * from "#/auth/roles";
export * from "#/auth/token-verifier";

/**
 * Contract policies are not wired by the generator, so the application installs them: the guard
 * enforces the exported access rules and the interceptor carries the verified actor to use cases.
 */
export function installAuth(app: INestApplication, verify: TokenVerifier): void {
  app.useGlobalGuards(new AuthGuard(verify));
  app.useGlobalInterceptors(new ActorInterceptor());
}

/**
 * Database-backed authorization: the token only proves who signed in; accounts, roles and scoped grants come from the
 * `auth` schema. Protected routes need the platform permission of their policy; record-level checks use `auth.can`.
 */
export function installDatabaseAuth(app: INestApplication, verify: (token: string) => Promise<VerifiedToken>, authority: AccessAuthority): void {
  app.useGlobalGuards(new DatabaseAuthGuard(verify, authority));
  app.useGlobalInterceptors(new ActorInterceptor());
}
