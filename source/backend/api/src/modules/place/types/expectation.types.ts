// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { ExpectationBasis } from '#/types/place/expectation-basis.enum';
import type { ExpectationStatus } from '#/types/place/expectation-status.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  EXPECTATION_RELATION_KEYS,
  EXPECTATION_SORTABLE_FIELDS,
  EXPECTATION_SEARCHABLE_FIELDS,
  EXPECTATION_FILTERABLE_FIELDS,
  EXPECTATION_DATE_RANGE_FIELDS,
  EXPECTATION_SELECTABLE_FIELDS,
  EXPECTATION_DEFAULT_SELECT_FIELDS,
  EXPECTATION_EDITABLE_FIELDS
} from './expectation.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Expectation */
export interface IExpectation extends B.IBase {
  basis: ExpectationBasis;
  facilityTypeId: string | null;
  isCurrent: boolean;
  maxCount: number | null;
  minCount: number;
  resolvedOccupancyId: string | null;
  roleId: string;
  scopeGeoUnitId: string | null;
  status: ExpectationStatus;
  subjectId: string;
  subjectKind: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ExpectationKey = keyof IExpectation;

export type ExpectationRelationKey = (typeof EXPECTATION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IExpectationReadonlyFields = B.IBaseReadonlyFields;

export type IExpectationContextualFields = never;

export type IExpectationSensitiveFields = never;

export type IExpectationTransitionFields = never;

export type IExpectationImmutableFields =
  | IExpectationReadonlyFields
  | IExpectationContextualFields
  | IExpectationSensitiveFields
  | IExpectationTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IExpectationCreatable = Omit<IExpectation, IExpectationImmutableFields | ExpectationRelationKey>;

export type IExpectationSystemWritable = Omit<IExpectation, B.IBaseReadonlyFields | ExpectationRelationKey>;

export type IExpectationUpdatable = Partial<Omit<IExpectation, IExpectationImmutableFields | ExpectationRelationKey>>;

export interface IExpectationTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ExpectationSortableField = (typeof EXPECTATION_SORTABLE_FIELDS)[number];

export type ExpectationSearchableField = (typeof EXPECTATION_SEARCHABLE_FIELDS)[number];

export type ExpectationFilterableField = (typeof EXPECTATION_FILTERABLE_FIELDS)[number];

export type ExpectationDateRangeField = (typeof EXPECTATION_DATE_RANGE_FIELDS)[number];

export type ExpectationSelectableField = (typeof EXPECTATION_SELECTABLE_FIELDS)[number];

export type ExpectationDefaultSelectField = (typeof EXPECTATION_DEFAULT_SELECT_FIELDS)[number];

export type ExpectationEditableField = (typeof EXPECTATION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IExpectationAsOneRelationConfig = Q.IOneRelationConfig<'expectation', ExpectationSelectableField>;

export type IExpectationAsManyRelationConfig = Q.IManyRelationConfig<'expectations', ExpectationSelectableField, ExpectationSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IExpectationAsOneRelationQuery = Q.IAsOneRelationQuery<IExpectation, ExpectationSelectableField>;

export type IExpectationAsManyRelationQuery = Q.IAsManyRelationQuery<IExpectation, ExpectationSelectableField, ExpectationSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IExpectationRelationMap extends Record<ExpectationRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IExpectationRelationQueries = Q.IBaseRelationQueries<IExpectation, ExpectationRelationKey, IExpectationRelationMap>;

export type IExpectationItemQuery = Q.IBaseItemQuery<
  IExpectation,
  ExpectationRelationKey,
  ExpectationSelectableField,
  ExpectationRelationKey,
  ExpectationSelectableField,
  IExpectationRelationMap,
  IExpectationRelationQueries
>;

export type IExpectationListQuery = Q.IBaseListQuery<
  IExpectation,
  ExpectationRelationKey,
  ExpectationSelectableField,
  ExpectationSortableField,
  ExpectationRelationKey,
  ExpectationSelectableField,
  ExpectationSortableField,
  ExpectationDateRangeField,
  ExpectationFilterableField,
  IExpectationRelationMap,
  IExpectationRelationQueries,
  IExpectationItemQuery
>;