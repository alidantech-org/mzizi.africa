import type { INestApplication } from "@nestjs/common";

import { ActorInterceptor } from "#/auth/actor.interceptor";
import { AuthGuard } from "#/auth/auth.guard";
import type { TokenVerifier } from "#/auth/token-verifier";

export * from "#/auth/actor-context";
export * from "#/auth/actor.interceptor";
export * from "#/auth/auth.guard";
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
