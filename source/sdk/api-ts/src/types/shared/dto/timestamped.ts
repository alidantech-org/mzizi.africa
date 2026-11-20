/** Base for operational records: identity, creation time and last-change time. */
export interface SharedTimestamped {
  createdAt: string;
  id: string;
  updatedAt: string;
}
