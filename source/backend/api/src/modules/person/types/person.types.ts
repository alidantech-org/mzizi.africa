// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { LifeStatus } from '#/types/person/life-status.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PERSON_RELATION_KEYS,
  PERSON_SORTABLE_FIELDS,
  PERSON_SEARCHABLE_FIELDS,
  PERSON_FILTERABLE_FIELDS,
  PERSON_DATE_RANGE_FIELDS,
  PERSON_SELECTABLE_FIELDS,
  PERSON_DEFAULT_SELECT_FIELDS,
  PERSON_EDITABLE_FIELDS
} from './person.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Person */
export interface IPerson extends B.IBase {
  birthDate: Date | null;
  birthDatePrecision: DatePrecision | null;
  birthPlaceId: string | null;
  code: string;
  deathDate: Date | null;
  deathDatePrecision: DatePrecision | null;
  displayName: string;
  familyName: string | null;
  givenName: string | null;
  isCurrent: boolean;
  lifeStatus: LifeStatus;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PersonKey = keyof IPerson;

export type PersonRelationKey = (typeof PERSON_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPersonReadonlyFields = B.IBaseReadonlyFields;

export type IPersonContextualFields = never;

export type IPersonSensitiveFields = never;

export type IPersonTransitionFields = never;

export type IPersonImmutableFields =
  | IPersonReadonlyFields
  | IPersonContextualFields
  | IPersonSensitiveFields
  | IPersonTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPersonCreatable = Omit<IPerson, IPersonImmutableFields | PersonRelationKey>;

export type IPersonSystemWritable = Omit<IPerson, B.IBaseReadonlyFields | PersonRelationKey>;

export type IPersonUpdatable = Partial<Omit<IPerson, IPersonImmutableFields | PersonRelationKey>>;

export interface IPersonTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PersonSortableField = (typeof PERSON_SORTABLE_FIELDS)[number];

export type PersonSearchableField = (typeof PERSON_SEARCHABLE_FIELDS)[number];

export type PersonFilterableField = (typeof PERSON_FILTERABLE_FIELDS)[number];

export type PersonDateRangeField = (typeof PERSON_DATE_RANGE_FIELDS)[number];

export type PersonSelectableField = (typeof PERSON_SELECTABLE_FIELDS)[number];

export type PersonDefaultSelectField = (typeof PERSON_DEFAULT_SELECT_FIELDS)[number];

export type PersonEditableField = (typeof PERSON_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPersonAsOneRelationConfig = Q.IOneRelationConfig<'person', PersonSelectableField>;

export type IPersonAsManyRelationConfig = Q.IManyRelationConfig<'persons', PersonSelectableField, PersonSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPersonAsOneRelationQuery = Q.IAsOneRelationQuery<IPerson, PersonSelectableField>;

export type IPersonAsManyRelationQuery = Q.IAsManyRelationQuery<IPerson, PersonSelectableField, PersonSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPersonRelationMap extends Record<PersonRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPersonRelationQueries = Q.IBaseRelationQueries<IPerson, PersonRelationKey, IPersonRelationMap>;

export type IPersonItemQuery = Q.IBaseItemQuery<
  IPerson,
  PersonRelationKey,
  PersonSelectableField,
  PersonRelationKey,
  PersonSelectableField,
  IPersonRelationMap,
  IPersonRelationQueries
>;

export type IPersonListQuery = Q.IBaseListQuery<
  IPerson,
  PersonRelationKey,
  PersonSelectableField,
  PersonSortableField,
  PersonRelationKey,
  PersonSelectableField,
  PersonSortableField,
  PersonDateRangeField,
  PersonFilterableField,
  IPersonRelationMap,
  IPersonRelationQueries,
  IPersonItemQuery
>;