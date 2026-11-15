// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { VerificationOutcome } from '#/modules/source/verification-outcome.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as EvidenceTypes from '#/modules/source/types/evidence.types';
import type * as ValueTypes from '#/modules/reference/types/value.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  VERIFICATIONS_RELATION_KEYS,
  VERIFICATIONS_SORTABLE_FIELDS,
  VERIFICATIONS_SEARCHABLE_FIELDS,
  VERIFICATIONS_FILTERABLE_FIELDS,
  VERIFICATIONS_DATE_RANGE_FIELDS,
  VERIFICATIONS_SELECTABLE_FIELDS,
  VERIFICATIONS_DEFAULT_SELECT_FIELDS,
  VERIFICATIONS_EDITABLE_FIELDS
} from './verifications.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Append-only attributable assessment; disagreement and insufficient evidence remain explicit outcomes. */
export interface IVerifications extends B.IBase {
  assessedAt: Date;
  confidence: number | null;
  evidenceId: string;
  explanation: string;
  methodId: string;
  outcome: VerificationOutcome;
  reviewerSnapshot: string;
  supersedesId: string | null;
  readonly evidence?: EvidenceTypes.IEvidence;
  readonly method?: ValueTypes.IValue;
  readonly supersedes?: IVerifications;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type VerificationsKey = keyof IVerifications;

export type VerificationsRelationKey = (typeof VERIFICATIONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IVerificationsReadonlyFields = B.IBaseReadonlyFields;

export type IVerificationsContextualFields = never;

export type IVerificationsSensitiveFields = never;

export type IVerificationsTransitionFields = never;

export type IVerificationsImmutableFields =
  | IVerificationsReadonlyFields
  | IVerificationsContextualFields
  | IVerificationsSensitiveFields
  | IVerificationsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IVerificationsCreatable = Omit<IVerifications, IVerificationsImmutableFields | VerificationsRelationKey>;

export type IVerificationsSystemWritable = Omit<IVerifications, B.IBaseReadonlyFields | VerificationsRelationKey>;

export type IVerificationsUpdatable = Partial<Omit<IVerifications, IVerificationsImmutableFields | VerificationsRelationKey>>;

export interface IVerificationsTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type VerificationsSortableField = (typeof VERIFICATIONS_SORTABLE_FIELDS)[number];

export type VerificationsSearchableField = (typeof VERIFICATIONS_SEARCHABLE_FIELDS)[number];

export type VerificationsFilterableField = (typeof VERIFICATIONS_FILTERABLE_FIELDS)[number];

export type VerificationsDateRangeField = (typeof VERIFICATIONS_DATE_RANGE_FIELDS)[number];

export type VerificationsSelectableField = (typeof VERIFICATIONS_SELECTABLE_FIELDS)[number];

export type VerificationsDefaultSelectField = (typeof VERIFICATIONS_DEFAULT_SELECT_FIELDS)[number];

export type VerificationsEditableField = (typeof VERIFICATIONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IVerificationsAsOneRelationConfig = Q.IOneRelationConfig<'verifications', VerificationsSelectableField>;

export type IVerificationsAsManyRelationConfig = Q.IManyRelationConfig<'verificationss', VerificationsSelectableField, VerificationsSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IVerificationsAsOneRelationQuery = Q.IAsOneRelationQuery<IVerifications, VerificationsSelectableField>;

export type IVerificationsAsManyRelationQuery = Q.IAsManyRelationQuery<IVerifications, VerificationsSelectableField, VerificationsSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IVerificationsRelationMap extends Record<VerificationsRelationKey, unknown> {
  evidence: EvidenceTypes.IEvidenceAsOneRelationQuery;
  method: ValueTypes.IValueAsOneRelationQuery;
  supersedes: IVerificationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IVerificationsRelationQueries = Q.IBaseRelationQueries<IVerifications, VerificationsRelationKey, IVerificationsRelationMap>;

export type IVerificationsItemQuery = Q.IBaseItemQuery<
  IVerifications,
  VerificationsRelationKey,
  VerificationsSelectableField,
  VerificationsRelationKey,
  VerificationsSelectableField,
  IVerificationsRelationMap,
  IVerificationsRelationQueries
>;

export type IVerificationsListQuery = Q.IBaseListQuery<
  IVerifications,
  VerificationsRelationKey,
  VerificationsSelectableField,
  VerificationsSortableField,
  VerificationsRelationKey,
  VerificationsSelectableField,
  VerificationsSortableField,
  VerificationsDateRangeField,
  VerificationsFilterableField,
  IVerificationsRelationMap,
  IVerificationsRelationQueries,
  IVerificationsItemQuery
>;