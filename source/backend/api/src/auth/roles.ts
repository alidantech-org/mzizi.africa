/**
 * Roles and the policies contracts name. Contracts only say which policy an operation requires
 * (dryv/contracts/foundation/shared/access.ts); this file says what each policy means.
 */
export const ROLES = ["reader", "contributor", "reviewer", "admin"] as const;
export type Role = (typeof ROLES)[number];

export type PolicyName = "ContributorAccess" | "ReviewerAccess" | "AdminAccess";

const minimumRole: Record<PolicyName, Role> = {
  ContributorAccess: "contributor",
  ReviewerAccess: "reviewer",
  AdminAccess: "admin",
};

const rank = (role: Role): number => ROLES.indexOf(role);

export function satisfies(role: Role, policy: PolicyName): boolean {
  return rank(role) >= rank(minimumRole[policy]);
}

/** The highest role named by a token's roles claim; unknown names are ignored. */
export function highestRole(claim: unknown): Role {
  const names = Array.isArray(claim) ? claim : typeof claim === "string" ? [claim] : [];
  return names.filter((name): name is Role => (ROLES as readonly string[]).includes(name)).reduce<Role>((best, role) => (rank(role) > rank(best) ? role : best), "reader");
}
