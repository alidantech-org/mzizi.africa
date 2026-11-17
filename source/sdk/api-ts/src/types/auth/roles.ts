/** Named permission bundle with a policy version; protected roles cannot be edited away. */
export interface AuthRoles {
  code: string;
  createdAt: string;
  description?: string | null;
  id: string;
  managingInstitutionRefId?: string | null;
  policyVersion: string;
  protected: boolean;
  retiredAt?: string | null;
  title: string;
}
