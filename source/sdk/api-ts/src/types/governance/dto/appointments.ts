import { GovernanceAppointmentStep } from "#sdk/types/governance/enums/appointment-step.ts";

/** One step that put a holder in office; appointments by Parliament or a board are recorded like those by a person. */
export interface GovernanceAppointments {
  actorHolderId?: string | null;
  actorId: string;
  createdAt: string;
  deletedAt?: string | null;
  fromYear?: number | null;
  holderId: string;
  id: string;
  motionId?: string | null;
  onDate?: string | null;
  step: GovernanceAppointmentStep;
  updatedAt: string;
  version: number;
}
