import { GovernanceAppointmentStep } from "#sdk/types/governance/enums/appointment-step.ts";

/** Office Detail Holders Steps */
export interface GovernanceOfficeDetailHoldersSteps {
  actorCode: string;
  actorHolderId: string | null;
  actorId: string;
  motionId: string | null;
  onDate: string | null;
  step: GovernanceAppointmentStep;
}
