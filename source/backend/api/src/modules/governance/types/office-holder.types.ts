// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DepartureReason } from '#/types/governance/departure-reason.enum';
import type { HolderStatus } from '#/types/governance/holder-status.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as OfficeTypes from '#/modules/governance/types/office.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  OFFICE_HOLDER_RELATION_KEYS,
  OFFICE_HOLDER_SORTABLE_FIELDS,
  OFFICE_HOLDER_SEARCHABLE_FIELDS,
  OFFICE_HOLDER_FILTERABLE_FIELDS,
  OFFICE_HOLDER_DATE_RANGE_FIELDS,
  OFFICE_HOLDER_SELECTABLE_FIELDS,
  OFFICE_HOLDER_DEFAULT_SELECT_FIELDS,
  OFFICE_HOLDER_EDITABLE_FIELDS
} from './office-holder.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Office Holder */
export interface IOfficeHolder extends B.IBase {
  artifactChecksum: string | null;
  artifactId: string | null;
  confidence: number | null;
  departureReason: DepartureReason | null;
  isCurrent: boolean;
  legalBasisId: string | null;
  licence: string | null;
  method: ProvenanceMethod;
  officeId: string;
  personId: string;
  retrievedAt: Date | null;
  selectionProcedureId: string | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  status: HolderStatus;
  termNumber: number | null;
  toolOrModel: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  readonly office?: OfficeTypes.IOffice;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type OfficeHolderKey = keyof IOfficeHolder;

export type OfficeHolderRelationKey = (typeof OFFICE_HOLDER_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IOfficeHolderReadonlyFields = B.IBaseReadonlyFields;

export type IOfficeHolderContextualFields = never;

export type IOfficeHolderSensitiveFields = never;

export type IOfficeHolderTransitionFields = never;

export type IOfficeHolderImmutableFields =
  | IOfficeHolderReadonlyFields
  | IOfficeHolderContextualFields
  | IOfficeHolderSensitiveFields
  | IOfficeHolderTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IOfficeHolderCreatable = Omit<IOfficeHolder, IOfficeHolderImmutableFields | OfficeHolderRelationKey>;

export type IOfficeHolderSystemWritable = Omit<IOfficeHolder, B.IBaseReadonlyFields | OfficeHolderRelationKey>;

export type IOfficeHolderUpdatable = Partial<Omit<IOfficeHolder, IOfficeHolderImmutableFields | OfficeHolderRelationKey>>;

export interface IOfficeHolderTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type OfficeHolderSortableField = (typeof OFFICE_HOLDER_SORTABLE_FIELDS)[number];

export type OfficeHolderSearchableField = (typeof OFFICE_HOLDER_SEARCHABLE_FIELDS)[number];

export type OfficeHolderFilterableField = (typeof OFFICE_HOLDER_FILTERABLE_FIELDS)[number];

export type OfficeHolderDateRangeField = (typeof OFFICE_HOLDER_DATE_RANGE_FIELDS)[number];

export type OfficeHolderSelectableField = (typeof OFFICE_HOLDER_SELECTABLE_FIELDS)[number];

export type OfficeHolderDefaultSelectField = (typeof OFFICE_HOLDER_DEFAULT_SELECT_FIELDS)[number];

export type OfficeHolderEditableField = (typeof OFFICE_HOLDER_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IOfficeHolderAsOneRelationConfig = Q.IOneRelationConfig<'officeHolder', OfficeHolderSelectableField>;

export type IOfficeHolderAsManyRelationConfig = Q.IManyRelationConfig<'officeHolders', OfficeHolderSelectableField, OfficeHolderSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IOfficeHolderAsOneRelationQuery = Q.IAsOneRelationQuery<IOfficeHolder, OfficeHolderSelectableField>;

export type IOfficeHolderAsManyRelationQuery = Q.IAsManyRelationQuery<IOfficeHolder, OfficeHolderSelectableField, OfficeHolderSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IOfficeHolderRelationMap extends Record<OfficeHolderRelationKey, unknown> {
  office: OfficeTypes.IOfficeAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IOfficeHolderRelationQueries = Q.IBaseRelationQueries<IOfficeHolder, OfficeHolderRelationKey, IOfficeHolderRelationMap>;

export type IOfficeHolderItemQuery = Q.IBaseItemQuery<
  IOfficeHolder,
  OfficeHolderRelationKey,
  OfficeHolderSelectableField,
  OfficeHolderRelationKey,
  OfficeHolderSelectableField,
  IOfficeHolderRelationMap,
  IOfficeHolderRelationQueries
>;

export type IOfficeHolderListQuery = Q.IBaseListQuery<
  IOfficeHolder,
  OfficeHolderRelationKey,
  OfficeHolderSelectableField,
  OfficeHolderSortableField,
  OfficeHolderRelationKey,
  OfficeHolderSelectableField,
  OfficeHolderSortableField,
  OfficeHolderDateRangeField,
  OfficeHolderFilterableField,
  IOfficeHolderRelationMap,
  IOfficeHolderRelationQueries,
  IOfficeHolderItemQuery
>;