import { type CanActivate, type ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";

import { accessRules } from "#/auth/access-rules.generated";
import type { Actor } from "#/auth/actor-context";
import type { AccessAuthority } from "#/auth/authority";
import type { PolicyName } from "#/auth/roles";
import type { VerifiedToken } from "#/auth/token-verifier";

/** The `namespace.action` permission each contract policy needs under database authorization. */
export const POLICY_PERMISSION_DB: Record<PolicyName, string> = {
  ContributorAccess: "audit.edit",
  ReviewerAccess: "audit.review",
  PipelineReadAccess: "pipeline.read",
  AssessmentDraftAccess: "pipeline.edit",
  AssessmentApproveAccess: "pipeline.review",
  CandidatePromoteAccess: "pipeline.publish",
  AdminAccess: "auth.edit",
  AccessManageAccess: "auth.edit",
};

/**
 * Guard for database authorization. Routes without a contract policy remain public reads. For a protected route:
 * verify the token, resolve the account from (issuer, subject), then require the route's platform-wide permission.
 * Unknown identities are 401; suspended accounts and missing permissions are 403. Routes that touch governed
 * records call the authority again from their use case with the table and record id (`can`, `canChange`).
 */
@Injectable()
export class DatabaseAuthGuard implements CanActivate {
  constructor(
    private readonly verify: (token: string) => Promise<VerifiedToken>,
    private readonly authority: AccessAuthority,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ method: string; route?: { path?: string }; headers: Record<string, string | undefined>; actor?: Actor }>();
    const policy = (accessRules as Record<string, PolicyName>)[`${request.method} ${request.route?.path ?? ""}`];
    if (!policy) return true;

    const [scheme, token] = (request.headers.authorization ?? "").split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token) throw new UnauthorizedException("a bearer token is required");

    const account = await this.authority.resolve(await this.verify(token));
    if (account.outcome === "account_not_active") throw new ForbiddenException("account_not_active");
    if (account.outcome !== "ok" || !account.accountId) throw new UnauthorizedException(account.outcome);

    const permission = POLICY_PERMISSION_DB[policy];
    if (!(await this.authority.canPlatform(account.accountId, permission))) throw new ForbiddenException(`${permission} is required`);

    request.actor = { actorId: account.accountId, role: "reader" };
    return true;
  }
}
