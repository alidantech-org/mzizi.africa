// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as PersonTypes from '#/modules/person/types/person.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PERSON_PROFILE_RELATION_KEYS,
  PERSON_PROFILE_SORTABLE_FIELDS,
  PERSON_PROFILE_SEARCHABLE_FIELDS,
  PERSON_PROFILE_FILTERABLE_FIELDS,
  PERSON_PROFILE_DATE_RANGE_FIELDS,
  PERSON_PROFILE_SELECTABLE_FIELDS,
  PERSON_PROFILE_DEFAULT_SELECT_FIELDS,
  PERSON_PROFILE_EDITABLE_FIELDS
} from './person-profile.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Person Profile */
export interface IPersonProfile extends B.IBase {
  biography: string | null;
  isCurrent: boolean;
  language: string | null;
  nationalityId: string | null;
  occupation: string | null;
  personId: string;
  summary: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly person?: PersonTypes.IPerson;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PersonProfileKey = keyof IPersonProfile;

export type PersonProfileRelationKey = (typeof PERSON_PROFILE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPersonProfileReadonlyFields = B.IBaseReadonlyFields;

export type IPersonProfileContextualFields = never;

export type IPersonProfileSensitiveFields = never;

export type IPersonProfileTransitionFields = never;

export type IPersonProfileImmutableFields =
  | IPersonProfileReadonlyFields
  | IPersonProfileContextualFields
  | IPersonProfileSensitiveFields
  | IPersonProfileTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPersonProfileCreatable = Omit<IPersonProfile, IPersonProfileImmutableFields | PersonProfileRelationKey>;

export type IPersonProfileSystemWritable = Omit<IPersonProfile, B.IBaseReadonlyFields | PersonProfileRelationKey>;

export type IPersonProfileUpdatable = Partial<Omit<IPersonProfile, IPersonProfileImmutableFields | PersonProfileRelationKey>>;

export interface IPersonProfileTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PersonProfileSortableField = (typeof PERSON_PROFILE_SORTABLE_FIELDS)[number];

export type PersonProfileSearchableField = (typeof PERSON_PROFILE_SEARCHABLE_FIELDS)[number];

export type PersonProfileFilterableField = (typeof PERSON_PROFILE_FILTERABLE_FIELDS)[number];

export type PersonProfileDateRangeField = (typeof PERSON_PROFILE_DATE_RANGE_FIELDS)[number];

export type PersonProfileSelectableField = (typeof PERSON_PROFILE_SELECTABLE_FIELDS)[number];

export type PersonProfileDefaultSelectField = (typeof PERSON_PROFILE_DEFAULT_SELECT_FIELDS)[number];

export type PersonProfileEditableField = (typeof PERSON_PROFILE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPersonProfileAsOneRelationConfig = Q.IOneRelationConfig<'personProfile', PersonProfileSelectableField>;

export type IPersonProfileAsManyRelationConfig = Q.IManyRelationConfig<'personProfiles', PersonProfileSelectableField, PersonProfileSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPersonProfileAsOneRelationQuery = Q.IAsOneRelationQuery<IPersonProfile, PersonProfileSelectableField>;

export type IPersonProfileAsManyRelationQuery = Q.IAsManyRelationQuery<IPersonProfile, PersonProfileSelectableField, PersonProfileSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPersonProfileRelationMap extends Record<PersonProfileRelationKey, unknown> {
  person: PersonTypes.IPersonAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPersonProfileRelationQueries = Q.IBaseRelationQueries<IPersonProfile, PersonProfileRelationKey, IPersonProfileRelationMap>;

export type IPersonProfileItemQuery = Q.IBaseItemQuery<
  IPersonProfile,
  PersonProfileRelationKey,
  PersonProfileSelectableField,
  PersonProfileRelationKey,
  PersonProfileSelectableField,
  IPersonProfileRelationMap,
  IPersonProfileRelationQueries
>;

export type IPersonProfileListQuery = Q.IBaseListQuery<
  IPersonProfile,
  PersonProfileRelationKey,
  PersonProfileSelectableField,
  PersonProfileSortableField,
  PersonProfileRelationKey,
  PersonProfileSelectableField,
  PersonProfileSortableField,
  PersonProfileDateRangeField,
  PersonProfileFilterableField,
  IPersonProfileRelationMap,
  IPersonProfileRelationQueries,
  IPersonProfileItemQuery
>;