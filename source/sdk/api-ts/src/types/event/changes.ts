/** One reschedule, postponement, adjournment, cancellation or confirmation of an occurrence, with the reason, who decided it and under which law. History is the list of changes. */
export interface EventChanges {
  authorityEntityId?: string | null;
  basisProvisionId?: string | null;
  changeKindId: string;
  code: string;
  createdAt: string;
  decidedOn?: string | null;
  deletedAt?: string | null;
  explanation?: string | null;
  fromOn?: string | null;
  id: string;
  occurrenceId: string;
  reasonId?: string | null;
  replacementOccurrenceId?: string | null;
  sourceCitationId?: string | null;
  toOn?: string | null;
  updatedAt: string;
  version: number;
}
