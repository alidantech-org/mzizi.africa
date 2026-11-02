import { type CanActivate, type ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";

import { accessRules } from "#/auth/access-rules.generated";
import type { Actor } from "#/auth/actor-context";
import { satisfies, type PolicyName } from "#/auth/roles";
import type { TokenVerifier } from "#/auth/token-verifier";

/**
 * Global guard. Looks the route up in the rules exported from the contracts; routes without a rule
 * are public reads. A protected route needs a verified bearer token whose role satisfies the
 * policy: 401 without a valid token, 403 when the role is too low. The verified actor is placed on
 * the request; ActorInterceptor then holds it in async context for the use case to stamp onto the
 * record it writes (a guard cannot set async context for the handler itself).
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly verify: TokenVerifier) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ method: string; route?: { path?: string }; headers: Record<string, string | undefined>; actor?: Actor }>();
    const policy = (accessRules as Record<string, PolicyName>)[`${request.method} ${request.route?.path ?? ""}`];
    if (!policy) return true;

    const header = request.headers.authorization ?? "";
    const [scheme, token] = header.split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token) throw new UnauthorizedException("a bearer token is required");

    const actor = await this.verify(token);
    if (!satisfies(actor.role, policy, actor.permissions)) throw new ForbiddenException(`${policy} is required`);
    request.actor = actor;
    return true;
  }
}
