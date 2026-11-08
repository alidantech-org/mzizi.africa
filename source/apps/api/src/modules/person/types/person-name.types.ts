// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { NameKind } from '#/types/person/name-kind.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as PersonTypes from '#/modules/person/types/person.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PERSON_NAME_RELATION_KEYS,
  PERSON_NAME_SORTABLE_FIELDS,
  PERSON_NAME_SEARCHABLE_FIELDS,
  PERSON_NAME_FILTERABLE_FIELDS,
  PERSON_NAME_DATE_RANGE_FIELDS,
  PERSON_NAME_SELECTABLE_FIELDS,
  PERSON_NAME_DEFAULT_SELECT_FIELDS,
  PERSON_NAME_EDITABLE_FIELDS
} from './person-name.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Person Name */
export interface IPersonName extends B.IBase {
  isCurrent: boolean;
  kind: NameKind;
  language: string | null;
  name: string;
  personId: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly person?: PersonTypes.IPerson;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PersonNameKey = keyof IPersonName;

export type PersonNameRelationKey = (typeof PERSON_NAME_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPersonNameReadonlyFields = B.IBaseReadonlyFields;

export type IPersonNameContextualFields = never;

export type IPersonNameSensitiveFields = never;

export type IPersonNameTransitionFields = never;

export type IPersonNameImmutableFields =
  | IPersonNameReadonlyFields
  | IPersonNameContextualFields
  | IPersonNameSensitiveFields
  | IPersonNameTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPersonNameCreatable = Omit<IPersonName, IPersonNameImmutableFields | PersonNameRelationKey>;

export type IPersonNameSystemWritable = Omit<IPersonName, B.IBaseReadonlyFields | PersonNameRelationKey>;

export type IPersonNameUpdatable = Partial<Omit<IPersonName, IPersonNameImmutableFields | PersonNameRelationKey>>;

export interface IPersonNameTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PersonNameSortableField = (typeof PERSON_NAME_SORTABLE_FIELDS)[number];

export type PersonNameSearchableField = (typeof PERSON_NAME_SEARCHABLE_FIELDS)[number];

export type PersonNameFilterableField = (typeof PERSON_NAME_FILTERABLE_FIELDS)[number];

export type PersonNameDateRangeField = (typeof PERSON_NAME_DATE_RANGE_FIELDS)[number];

export type PersonNameSelectableField = (typeof PERSON_NAME_SELECTABLE_FIELDS)[number];

export type PersonNameDefaultSelectField = (typeof PERSON_NAME_DEFAULT_SELECT_FIELDS)[number];

export type PersonNameEditableField = (typeof PERSON_NAME_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPersonNameAsOneRelationConfig = Q.IOneRelationConfig<'personName', PersonNameSelectableField>;

export type IPersonNameAsManyRelationConfig = Q.IManyRelationConfig<'personNames', PersonNameSelectableField, PersonNameSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPersonNameAsOneRelationQuery = Q.IAsOneRelationQuery<IPersonName, PersonNameSelectableField>;

export type IPersonNameAsManyRelationQuery = Q.IAsManyRelationQuery<IPersonName, PersonNameSelectableField, PersonNameSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPersonNameRelationMap extends Record<PersonNameRelationKey, unknown> {
  person: PersonTypes.IPersonAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPersonNameRelationQueries = Q.IBaseRelationQueries<IPersonName, PersonNameRelationKey, IPersonNameRelationMap>;

export type IPersonNameItemQuery = Q.IBaseItemQuery<
  IPersonName,
  PersonNameRelationKey,
  PersonNameSelectableField,
  PersonNameRelationKey,
  PersonNameSelectableField,
  IPersonNameRelationMap,
  IPersonNameRelationQueries
>;

export type IPersonNameListQuery = Q.IBaseListQuery<
  IPersonName,
  PersonNameRelationKey,
  PersonNameSelectableField,
  PersonNameSortableField,
  PersonNameRelationKey,
  PersonNameSelectableField,
  PersonNameSortableField,
  PersonNameDateRangeField,
  PersonNameFilterableField,
  IPersonNameRelationMap,
  IPersonNameRelationQueries,
  IPersonNameItemQuery
>;