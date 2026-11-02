// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ManifestoTypes from '#/modules/elections/types/manifesto.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  MANIFESTO_COMMITMENT_RELATION_KEYS,
  MANIFESTO_COMMITMENT_SORTABLE_FIELDS,
  MANIFESTO_COMMITMENT_SEARCHABLE_FIELDS,
  MANIFESTO_COMMITMENT_FILTERABLE_FIELDS,
  MANIFESTO_COMMITMENT_DATE_RANGE_FIELDS,
  MANIFESTO_COMMITMENT_SELECTABLE_FIELDS,
  MANIFESTO_COMMITMENT_DEFAULT_SELECT_FIELDS,
  MANIFESTO_COMMITMENT_EDITABLE_FIELDS
} from './manifesto-commitment.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Manifesto Commitment */
export interface IManifestoCommitment extends B.IBase {
  artifactChecksum: string | null;
  artifactId: string | null;
  confidence: number | null;
  isCurrent: boolean;
  licence: string | null;
  manifestoId: string;
  method: ProvenanceMethod;
  parentId: string | null;
  retrievedAt: Date | null;
  sortOrder: number;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  text: string;
  toolOrModel: string | null;
  topicId: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  readonly manifesto?: ManifestoTypes.IManifesto;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ManifestoCommitmentKey = keyof IManifestoCommitment;

export type ManifestoCommitmentRelationKey = (typeof MANIFESTO_COMMITMENT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IManifestoCommitmentReadonlyFields = B.IBaseReadonlyFields;

export type IManifestoCommitmentContextualFields = never;

export type IManifestoCommitmentSensitiveFields = never;

export type IManifestoCommitmentTransitionFields = never;

export type IManifestoCommitmentImmutableFields =
  | IManifestoCommitmentReadonlyFields
  | IManifestoCommitmentContextualFields
  | IManifestoCommitmentSensitiveFields
  | IManifestoCommitmentTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IManifestoCommitmentCreatable = Omit<IManifestoCommitment, IManifestoCommitmentImmutableFields | ManifestoCommitmentRelationKey>;

export type IManifestoCommitmentSystemWritable = Omit<IManifestoCommitment, B.IBaseReadonlyFields | ManifestoCommitmentRelationKey>;

export type IManifestoCommitmentUpdatable = Partial<Omit<IManifestoCommitment, IManifestoCommitmentImmutableFields | ManifestoCommitmentRelationKey>>;

export interface IManifestoCommitmentTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ManifestoCommitmentSortableField = (typeof MANIFESTO_COMMITMENT_SORTABLE_FIELDS)[number];

export type ManifestoCommitmentSearchableField = (typeof MANIFESTO_COMMITMENT_SEARCHABLE_FIELDS)[number];

export type ManifestoCommitmentFilterableField = (typeof MANIFESTO_COMMITMENT_FILTERABLE_FIELDS)[number];

export type ManifestoCommitmentDateRangeField = (typeof MANIFESTO_COMMITMENT_DATE_RANGE_FIELDS)[number];

export type ManifestoCommitmentSelectableField = (typeof MANIFESTO_COMMITMENT_SELECTABLE_FIELDS)[number];

export type ManifestoCommitmentDefaultSelectField = (typeof MANIFESTO_COMMITMENT_DEFAULT_SELECT_FIELDS)[number];

export type ManifestoCommitmentEditableField = (typeof MANIFESTO_COMMITMENT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IManifestoCommitmentAsOneRelationConfig = Q.IOneRelationConfig<'manifestoCommitment', ManifestoCommitmentSelectableField>;

export type IManifestoCommitmentAsManyRelationConfig = Q.IManyRelationConfig<'manifestoCommitments', ManifestoCommitmentSelectableField, ManifestoCommitmentSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IManifestoCommitmentAsOneRelationQuery = Q.IAsOneRelationQuery<IManifestoCommitment, ManifestoCommitmentSelectableField>;

export type IManifestoCommitmentAsManyRelationQuery = Q.IAsManyRelationQuery<IManifestoCommitment, ManifestoCommitmentSelectableField, ManifestoCommitmentSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IManifestoCommitmentRelationMap extends Record<ManifestoCommitmentRelationKey, unknown> {
  manifesto: ManifestoTypes.IManifestoAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IManifestoCommitmentRelationQueries = Q.IBaseRelationQueries<IManifestoCommitment, ManifestoCommitmentRelationKey, IManifestoCommitmentRelationMap>;

export type IManifestoCommitmentItemQuery = Q.IBaseItemQuery<
  IManifestoCommitment,
  ManifestoCommitmentRelationKey,
  ManifestoCommitmentSelectableField,
  ManifestoCommitmentRelationKey,
  ManifestoCommitmentSelectableField,
  IManifestoCommitmentRelationMap,
  IManifestoCommitmentRelationQueries
>;

export type IManifestoCommitmentListQuery = Q.IBaseListQuery<
  IManifestoCommitment,
  ManifestoCommitmentRelationKey,
  ManifestoCommitmentSelectableField,
  ManifestoCommitmentSortableField,
  ManifestoCommitmentRelationKey,
  ManifestoCommitmentSelectableField,
  ManifestoCommitmentSortableField,
  ManifestoCommitmentDateRangeField,
  ManifestoCommitmentFilterableField,
  IManifestoCommitmentRelationMap,
  IManifestoCommitmentRelationQueries,
  IManifestoCommitmentItemQuery
>;