/** The named things an article is about, beyond its main identity (section 34.5). */
export interface MediaSubjects {
  articleId: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  identityId: string;
  roleTerm: string;
}
