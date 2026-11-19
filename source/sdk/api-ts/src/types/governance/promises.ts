/** Something a leader said they would do, with where and when, what was promised and its checked status. 'No record found' is a status backed by source coverage, never an empty cell. */
export interface GovernancePromises {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  dueOn?: string | null;
  id: string;
  madeOn: string;
  makerHolderId?: string | null;
  makerIndividualId?: string | null;
  occurrenceId?: string | null;
  officeId?: string | null;
  placeFeatureId?: string | null;
  quantity?: number | null;
  sittingId?: string | null;
  sourceCitationId?: string | null;
  speechId?: string | null;
  statement: string;
  statusAsOf: string;
  statusId: string;
  topicId?: string | null;
  unitId?: string | null;
  updatedAt: string;
  version: number;
}
