import type { ExperienceCountdownMilestone } from "#sdk/types/experience/countdown-milestone.ts";
import type { ExperienceRecurrenceRule } from "#sdk/types/experience/recurrence-rule.ts";

/** Countdown */
export interface ExperienceCountdown {
  daysAway: number;
  eventCode: string;
  knowledgeCode: string;
  knowledgeLabel: string;
  milestones: ExperienceCountdownMilestone[];
  name: string;
  plannedOn: string;
  rule?: ExperienceRecurrenceRule | null;
}
