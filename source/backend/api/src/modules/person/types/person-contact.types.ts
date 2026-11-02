// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { ContactKind } from '#/types/person/contact-kind.enum';
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
  PERSON_CONTACT_RELATION_KEYS,
  PERSON_CONTACT_SORTABLE_FIELDS,
  PERSON_CONTACT_SEARCHABLE_FIELDS,
  PERSON_CONTACT_FILTERABLE_FIELDS,
  PERSON_CONTACT_DATE_RANGE_FIELDS,
  PERSON_CONTACT_SELECTABLE_FIELDS,
  PERSON_CONTACT_DEFAULT_SELECT_FIELDS,
  PERSON_CONTACT_EDITABLE_FIELDS
} from './person-contact.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Person Contact */
export interface IPersonContact extends B.IBase {
  exposure: Exposure;
  isCurrent: boolean;
  kind: ContactKind;
  label: string | null;
  officeId: string | null;
  personId: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  value: string;
  readonly person?: PersonTypes.IPerson;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PersonContactKey = keyof IPersonContact;

export type PersonContactRelationKey = (typeof PERSON_CONTACT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPersonContactReadonlyFields = B.IBaseReadonlyFields;

export type IPersonContactContextualFields = never;

export type IPersonContactSensitiveFields = never;

export type IPersonContactTransitionFields = never;

export type IPersonContactImmutableFields =
  | IPersonContactReadonlyFields
  | IPersonContactContextualFields
  | IPersonContactSensitiveFields
  | IPersonContactTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPersonContactCreatable = Omit<IPersonContact, IPersonContactImmutableFields | PersonContactRelationKey>;

export type IPersonContactSystemWritable = Omit<IPersonContact, B.IBaseReadonlyFields | PersonContactRelationKey>;

export type IPersonContactUpdatable = Partial<Omit<IPersonContact, IPersonContactImmutableFields | PersonContactRelationKey>>;

export interface IPersonContactTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PersonContactSortableField = (typeof PERSON_CONTACT_SORTABLE_FIELDS)[number];

export type PersonContactSearchableField = (typeof PERSON_CONTACT_SEARCHABLE_FIELDS)[number];

export type PersonContactFilterableField = (typeof PERSON_CONTACT_FILTERABLE_FIELDS)[number];

export type PersonContactDateRangeField = (typeof PERSON_CONTACT_DATE_RANGE_FIELDS)[number];

export type PersonContactSelectableField = (typeof PERSON_CONTACT_SELECTABLE_FIELDS)[number];

export type PersonContactDefaultSelectField = (typeof PERSON_CONTACT_DEFAULT_SELECT_FIELDS)[number];

export type PersonContactEditableField = (typeof PERSON_CONTACT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPersonContactAsOneRelationConfig = Q.IOneRelationConfig<'personContact', PersonContactSelectableField>;

export type IPersonContactAsManyRelationConfig = Q.IManyRelationConfig<'personContacts', PersonContactSelectableField, PersonContactSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPersonContactAsOneRelationQuery = Q.IAsOneRelationQuery<IPersonContact, PersonContactSelectableField>;

export type IPersonContactAsManyRelationQuery = Q.IAsManyRelationQuery<IPersonContact, PersonContactSelectableField, PersonContactSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPersonContactRelationMap extends Record<PersonContactRelationKey, unknown> {
  person: PersonTypes.IPersonAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPersonContactRelationQueries = Q.IBaseRelationQueries<IPersonContact, PersonContactRelationKey, IPersonContactRelationMap>;

export type IPersonContactItemQuery = Q.IBaseItemQuery<
  IPersonContact,
  PersonContactRelationKey,
  PersonContactSelectableField,
  PersonContactRelationKey,
  PersonContactSelectableField,
  IPersonContactRelationMap,
  IPersonContactRelationQueries
>;

export type IPersonContactListQuery = Q.IBaseListQuery<
  IPersonContact,
  PersonContactRelationKey,
  PersonContactSelectableField,
  PersonContactSortableField,
  PersonContactRelationKey,
  PersonContactSelectableField,
  PersonContactSortableField,
  PersonContactDateRangeField,
  PersonContactFilterableField,
  IPersonContactRelationMap,
  IPersonContactRelationQueries,
  IPersonContactItemQuery
>;