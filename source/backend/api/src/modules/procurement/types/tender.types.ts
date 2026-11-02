// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { TenderStatus } from '#/types/procurement/tender-status.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  TENDER_RELATION_KEYS,
  TENDER_SORTABLE_FIELDS,
  TENDER_SEARCHABLE_FIELDS,
  TENDER_FILTERABLE_FIELDS,
  TENDER_DATE_RANGE_FIELDS,
  TENDER_SELECTABLE_FIELDS,
  TENDER_DEFAULT_SELECT_FIELDS,
  TENDER_EDITABLE_FIELDS
} from './tender.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Tender */
export interface ITender extends B.IBase {
  budgetId: string | null;
  closesOn: Date | null;
  code: string;
  currencyCode: string;
  estimatedValue: number | null;
  isCurrent: boolean;
  issuingUnitId: string;
  kindId: string;
  legalBasisId: string | null;
  methodId: string;
  procuringOfficeId: string | null;
  publishedOn: Date | null;
  status: TenderStatus;
  title: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type TenderKey = keyof ITender;

export type TenderRelationKey = (typeof TENDER_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ITenderReadonlyFields = B.IBaseReadonlyFields;

export type ITenderContextualFields = never;

export type ITenderSensitiveFields = never;

export type ITenderTransitionFields = never;

export type ITenderImmutableFields =
  | ITenderReadonlyFields
  | ITenderContextualFields
  | ITenderSensitiveFields
  | ITenderTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ITenderCreatable = Omit<ITender, ITenderImmutableFields | TenderRelationKey>;

export type ITenderSystemWritable = Omit<ITender, B.IBaseReadonlyFields | TenderRelationKey>;

export type ITenderUpdatable = Partial<Omit<ITender, ITenderImmutableFields | TenderRelationKey>>;

export interface ITenderTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type TenderSortableField = (typeof TENDER_SORTABLE_FIELDS)[number];

export type TenderSearchableField = (typeof TENDER_SEARCHABLE_FIELDS)[number];

export type TenderFilterableField = (typeof TENDER_FILTERABLE_FIELDS)[number];

export type TenderDateRangeField = (typeof TENDER_DATE_RANGE_FIELDS)[number];

export type TenderSelectableField = (typeof TENDER_SELECTABLE_FIELDS)[number];

export type TenderDefaultSelectField = (typeof TENDER_DEFAULT_SELECT_FIELDS)[number];

export type TenderEditableField = (typeof TENDER_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ITenderAsOneRelationConfig = Q.IOneRelationConfig<'tender', TenderSelectableField>;

export type ITenderAsManyRelationConfig = Q.IManyRelationConfig<'tenders', TenderSelectableField, TenderSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ITenderAsOneRelationQuery = Q.IAsOneRelationQuery<ITender, TenderSelectableField>;

export type ITenderAsManyRelationQuery = Q.IAsManyRelationQuery<ITender, TenderSelectableField, TenderSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ITenderRelationMap extends Record<TenderRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ITenderRelationQueries = Q.IBaseRelationQueries<ITender, TenderRelationKey, ITenderRelationMap>;

export type ITenderItemQuery = Q.IBaseItemQuery<
  ITender,
  TenderRelationKey,
  TenderSelectableField,
  TenderRelationKey,
  TenderSelectableField,
  ITenderRelationMap,
  ITenderRelationQueries
>;

export type ITenderListQuery = Q.IBaseListQuery<
  ITender,
  TenderRelationKey,
  TenderSelectableField,
  TenderSortableField,
  TenderRelationKey,
  TenderSelectableField,
  TenderSortableField,
  TenderDateRangeField,
  TenderFilterableField,
  ITenderRelationMap,
  ITenderRelationQueries,
  ITenderItemQuery
>;