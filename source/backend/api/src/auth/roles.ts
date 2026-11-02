/**
 * Roles and the policies contracts name. Contracts only say which policy an operation requires
 * (dryv/contracts/foundation/shared/access.ts); this file says what each policy means.
 */
export const ROLES = ["reader", "contributor", "reviewer", "admin"] as const;
export type Role = (typeof ROLES)[number];

export type PolicyName = "ContributorAccess" | "ReviewerAccess" | "AdminAccess" | "PipelineReadAccess" | "AssessmentDraftAccess" | "AssessmentApproveAccess" | "CandidatePromoteAccess" | "AccessManageAccess";

/** Things an actor may do. Mirrors `access.permissions` in the database engine's migration. */
export const PERMISSIONS = ["record.read", "comment.create", "evidence.create", "review.decide", "pipeline.read", "assessment.draft", "assessment.approve", "candidate.promote", "access.manage"] as const;
export type Permission = (typeof PERMISSIONS)[number];

/** Role bundles. Mirrors `access.role_permissions`; a role is nothing but a named set of permissions. */
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  reader: ["record.read"],
  contributor: ["record.read", "comment.create", "evidence.create"],
  reviewer: ["record.read", "comment.create", "evidence.create", "review.decide", "pipeline.read", "assessment.draft"],
  admin: PERMISSIONS,
};

/** What each contract policy needs. Policies are checked as permissions so roles can grow without code changes. */
export const POLICY_PERMISSION: Record<PolicyName, Permission> = {
  ContributorAccess: "comment.create",
  ReviewerAccess: "review.decide",
  AdminAccess: "access.manage",
  PipelineReadAccess: "pipeline.read",
  AssessmentDraftAccess: "assessment.draft",
  AssessmentApproveAccess: "assessment.approve",
  CandidatePromoteAccess: "candidate.promote",
  AccessManageAccess: "access.manage",
};

const rank = (role: Role): number => ROLES.indexOf(role);

export function permissionsOf(role: Role, extra: readonly string[] = []): Set<string> {
  return new Set<string>([...ROLE_PERMISSIONS[role], ...extra.filter((code) => (PERMISSIONS as readonly string[]).includes(code))]);
}

/** Does a role, plus any permissions granted directly, satisfy the policy? */
export function satisfies(role: Role, policy: PolicyName, extra: readonly string[] = []): boolean {
  return permissionsOf(role, extra).has(POLICY_PERMISSION[policy]);
}

/** The highest role named by a token's roles claim; unknown names are ignored. */
export function highestRole(claim: unknown): Role {
  const names = Array.isArray(claim) ? claim : typeof claim === "string" ? [claim] : [];
  return names.filter((name): name is Role => (ROLES as readonly string[]).includes(name)).reduce<Role>((best, role) => (rank(role) > rank(best) ? role : best), "reader");
}
