/** The security ceiling of a delegation: the roles a delegate may receive through it. */
export interface AuthAllowances {
  delegationId: string;
  roleId: string;
}
