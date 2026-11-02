// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  VERIFICATION_RELATION_KEYS,
  VERIFICATION_SORTABLE_FIELDS,
  VERIFICATION_SEARCHABLE_FIELDS,
  VERIFICATION_FILTERABLE_FIELDS,
  VERIFICATION_DATE_RANGE_FIELDS,
  VERIFICATION_SELECTABLE_FIELDS,
  VERIFICATION_DEFAULT_SELECT_FIELDS,
  VERIFICATION_EDITABLE_FIELDS
} from './verification.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Verification */
export interface IVerification extends B.IBase {
  decidedBy: string | null;
  decisionId: string | null;
  isCurrent: boolean;
  rationale: string | null;
  state: VerificationState;
  targetId: string;
  targetKind: string;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type VerificationKey = keyof IVerification;

export type VerificationRelationKey = (typeof VERIFICATION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IVerificationReadonlyFields = B.IBaseReadonlyFields;

export type IVerificationContextualFields = never;

export type IVerificationSensitiveFields = never;

export type IVerificationTransitionFields = never;

export type IVerificationImmutableFields =
  | IVerificationReadonlyFields
  | IVerificationContextualFields
  | IVerificationSensitiveFields
  | IVerificationTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IVerificationCreatable = Omit<IVerification, IVerificationImmutableFields | VerificationRelationKey>;

export type IVerificationSystemWritable = Omit<IVerification, B.IBaseReadonlyFields | VerificationRelationKey>;

export type IVerificationUpdatable = Partial<Omit<IVerification, IVerificationImmutableFields | VerificationRelationKey>>;

export interface IVerificationTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type VerificationSortableField = (typeof VERIFICATION_SORTABLE_FIELDS)[number];

export type VerificationSearchableField = (typeof VERIFICATION_SEARCHABLE_FIELDS)[number];

export type VerificationFilterableField = (typeof VERIFICATION_FILTERABLE_FIELDS)[number];

export type VerificationDateRangeField = (typeof VERIFICATION_DATE_RANGE_FIELDS)[number];

export type VerificationSelectableField = (typeof VERIFICATION_SELECTABLE_FIELDS)[number];

export type VerificationDefaultSelectField = (typeof VERIFICATION_DEFAULT_SELECT_FIELDS)[number];

export type VerificationEditableField = (typeof VERIFICATION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IVerificationAsOneRelationConfig = Q.IOneRelationConfig<'verification', VerificationSelectableField>;

export type IVerificationAsManyRelationConfig = Q.IManyRelationConfig<'verifications', VerificationSelectableField, VerificationSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IVerificationAsOneRelationQuery = Q.IAsOneRelationQuery<IVerification, VerificationSelectableField>;

export type IVerificationAsManyRelationQuery = Q.IAsManyRelationQuery<IVerification, VerificationSelectableField, VerificationSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IVerificationRelationMap extends Record<VerificationRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IVerificationRelationQueries = Q.IBaseRelationQueries<IVerification, VerificationRelationKey, IVerificationRelationMap>;

export type IVerificationItemQuery = Q.IBaseItemQuery<
  IVerification,
  VerificationRelationKey,
  VerificationSelectableField,
  VerificationRelationKey,
  VerificationSelectableField,
  IVerificationRelationMap,
  IVerificationRelationQueries
>;

export type IVerificationListQuery = Q.IBaseListQuery<
  IVerification,
  VerificationRelationKey,
  VerificationSelectableField,
  VerificationSortableField,
  VerificationRelationKey,
  VerificationSelectableField,
  VerificationSortableField,
  VerificationDateRangeField,
  VerificationFilterableField,
  IVerificationRelationMap,
  IVerificationRelationQueries,
  IVerificationItemQuery
>;