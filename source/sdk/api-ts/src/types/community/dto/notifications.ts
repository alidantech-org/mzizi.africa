/** A notification to send; partitioned by month of creation. */
export interface CommunityNotifications {
  createdAt: string;
  id: string;
  identityId?: string | null;
  keyId: string;
  kindTerm: string;
  occurrenceId?: string | null;
  postCountryId?: string | null;
  postId?: string | null;
}
