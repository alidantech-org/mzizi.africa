// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { Exposure } from '#/types/person/exposure.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as PersonTypes from '#/modules/person/types/person.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PERSON_HANDLE_RELATION_KEYS,
  PERSON_HANDLE_SORTABLE_FIELDS,
  PERSON_HANDLE_SEARCHABLE_FIELDS,
  PERSON_HANDLE_FILTERABLE_FIELDS,
  PERSON_HANDLE_DATE_RANGE_FIELDS,
  PERSON_HANDLE_SELECTABLE_FIELDS,
  PERSON_HANDLE_DEFAULT_SELECT_FIELDS,
  PERSON_HANDLE_EDITABLE_FIELDS
} from './person-handle.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Person Handle */
export interface IPersonHandle extends B.IBase {
  exposure: Exposure;
  handle: string;
  isCurrent: boolean;
  isVerified: boolean;
  personId: string;
  platformId: string;
  url: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly person?: PersonTypes.IPerson;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PersonHandleKey = keyof IPersonHandle;

export type PersonHandleRelationKey = (typeof PERSON_HANDLE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPersonHandleReadonlyFields = B.IBaseReadonlyFields;

export type IPersonHandleContextualFields = never;

export type IPersonHandleSensitiveFields = never;

export type IPersonHandleTransitionFields = never;

export type IPersonHandleImmutableFields =
  | IPersonHandleReadonlyFields
  | IPersonHandleContextualFields
  | IPersonHandleSensitiveFields
  | IPersonHandleTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPersonHandleCreatable = Omit<IPersonHandle, IPersonHandleImmutableFields | PersonHandleRelationKey>;

export type IPersonHandleSystemWritable = Omit<IPersonHandle, B.IBaseReadonlyFields | PersonHandleRelationKey>;

export type IPersonHandleUpdatable = Partial<Omit<IPersonHandle, IPersonHandleImmutableFields | PersonHandleRelationKey>>;

export interface IPersonHandleTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PersonHandleSortableField = (typeof PERSON_HANDLE_SORTABLE_FIELDS)[number];

export type PersonHandleSearchableField = (typeof PERSON_HANDLE_SEARCHABLE_FIELDS)[number];

export type PersonHandleFilterableField = (typeof PERSON_HANDLE_FILTERABLE_FIELDS)[number];

export type PersonHandleDateRangeField = (typeof PERSON_HANDLE_DATE_RANGE_FIELDS)[number];

export type PersonHandleSelectableField = (typeof PERSON_HANDLE_SELECTABLE_FIELDS)[number];

export type PersonHandleDefaultSelectField = (typeof PERSON_HANDLE_DEFAULT_SELECT_FIELDS)[number];

export type PersonHandleEditableField = (typeof PERSON_HANDLE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPersonHandleAsOneRelationConfig = Q.IOneRelationConfig<'personHandle', PersonHandleSelectableField>;

export type IPersonHandleAsManyRelationConfig = Q.IManyRelationConfig<'personHandles', PersonHandleSelectableField, PersonHandleSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPersonHandleAsOneRelationQuery = Q.IAsOneRelationQuery<IPersonHandle, PersonHandleSelectableField>;

export type IPersonHandleAsManyRelationQuery = Q.IAsManyRelationQuery<IPersonHandle, PersonHandleSelectableField, PersonHandleSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPersonHandleRelationMap extends Record<PersonHandleRelationKey, unknown> {
  person: PersonTypes.IPersonAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPersonHandleRelationQueries = Q.IBaseRelationQueries<IPersonHandle, PersonHandleRelationKey, IPersonHandleRelationMap>;

export type IPersonHandleItemQuery = Q.IBaseItemQuery<
  IPersonHandle,
  PersonHandleRelationKey,
  PersonHandleSelectableField,
  PersonHandleRelationKey,
  PersonHandleSelectableField,
  IPersonHandleRelationMap,
  IPersonHandleRelationQueries
>;

export type IPersonHandleListQuery = Q.IBaseListQuery<
  IPersonHandle,
  PersonHandleRelationKey,
  PersonHandleSelectableField,
  PersonHandleSortableField,
  PersonHandleRelationKey,
  PersonHandleSelectableField,
  PersonHandleSortableField,
  PersonHandleDateRangeField,
  PersonHandleFilterableField,
  IPersonHandleRelationMap,
  IPersonHandleRelationQueries,
  IPersonHandleItemQuery
>;