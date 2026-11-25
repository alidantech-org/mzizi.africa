/** An interface text key declared in contracts; unknown keys are refused and missing messages are gaps. */
export interface ProductKeys {
  appId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  description?: string | null;
  id: string;
  maxLength?: number | null;
  placeholders?: string[] | null;
  updatedAt: string;
  version: number;
}
