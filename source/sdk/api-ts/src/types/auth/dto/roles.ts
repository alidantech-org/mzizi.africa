/** A named permission bundle with a policy version. */
export interface AuthRoles {
  code: string;
  createdAt: string;
  description?: string | null;
  id: string;
  institutionId?: string | null;
  policyVersion: string;
  protected: boolean;
  retiredAt?: string | null;
  title: string;
}
