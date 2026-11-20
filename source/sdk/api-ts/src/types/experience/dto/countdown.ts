import type { ExperienceCountdownMilestone } from "#sdk/types/experience/dto/countdown-milestone.ts";
import type { ExperienceRecurrenceRule } from "#sdk/types/experience/dto/recurrence-rule.ts";

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
