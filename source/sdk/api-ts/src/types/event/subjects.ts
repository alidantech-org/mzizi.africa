import { SharedSubjectTable } from "#sdk/types/enums/shared/subject-table.ts";

/** What an event is about or belongs to: an election, an institution, a person, a facility, a bill. An election's registration and nomination dates are events attached to it here. */
export interface EventSubjects {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  eventId: string;
  id: string;
  roleId: string;
  subjectId: string;
  subjectTable: SharedSubjectTable;
  updatedAt: string;
  version: number;
}
