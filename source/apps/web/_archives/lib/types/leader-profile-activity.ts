import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type LeaderProfileActivityContributions } from "#/_archives/lib/types/leader-profile-activity-contributions";
import { type LeaderProfileActivityRecent } from "#/_archives/lib/types/leader-profile-activity-recent";
import { type LeaderProfileActivitySpeeches } from "#/_archives/lib/types/leader-profile-activity-speeches";
import { type LeaderProfileActivityVotes } from "#/_archives/lib/types/leader-profile-activity-votes";

/** Leader Profile Activity */
export interface LeaderProfileActivity {
  contributions: LeaderProfileActivityContributions;
  recent: LeaderProfileActivityRecent[];
  recorded: boolean;
  speeches: LeaderProfileActivitySpeeches[];
  votes: LeaderProfileActivityVotes;
}

/** Field metadata for forms and results. */
export const LeaderProfileActivityFields: readonly FieldMeta[] = [
  {
    name: "contributions",
    label: "Contributions",
    kind: "other",
    required: true,
  },
  { name: "recent", label: "Recent", kind: "other", required: true },
  { name: "recorded", label: "Recorded", kind: "boolean", required: true },
  { name: "speeches", label: "Speeches", kind: "other", required: true },
  { name: "votes", label: "Votes", kind: "other", required: true },
];
