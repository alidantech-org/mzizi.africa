// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as IndividualsTypes from "#/modules/official/schema/types/individuals/individuals.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  CONTACTS_RELATION_KEYS,
  CONTACTS_SORTABLE_FIELDS,
  CONTACTS_SEARCHABLE_FIELDS,
  CONTACTS_FILTERABLE_FIELDS,
  CONTACTS_DATE_RANGE_FIELDS,
  CONTACTS_SELECTABLE_FIELDS,
  CONTACTS_DEFAULT_SELECT_FIELDS,
  CONTACTS_EDITABLE_FIELDS,
} from "./contacts.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One sourced contact channel for exactly one identity; visibility class governs handling of private values. */
export interface IContacts extends B.IBase {
  entityId: string | null;
  individualId: string | null;
  kindId: string;
  sourceCitationId: string | null;
  validFrom: Date | null;
  validUntil: Date | null;
  value: string;
  visibilityId: string;
  readonly entity?: EntitiesTypes.IEntities;
  readonly individual?: IndividualsTypes.IIndividuals;
  readonly kind?: ValueTypes.IValue;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly visibility?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ContactsKey = keyof IContacts;

export type ContactsRelationKey = (typeof CONTACTS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IContactsReadonlyFields = B.IBaseReadonlyFields;

export type IContactsContextualFields = never;

export type IContactsSensitiveFields = never;

export type IContactsTransitionFields = never;

export type IContactsImmutableFields =
  | IContactsReadonlyFields
  | IContactsContextualFields
  | IContactsSensitiveFields
  | IContactsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IContactsCreatable = Omit<IContacts, IContactsImmutableFields | ContactsRelationKey>;

export type IContactsSystemWritable = Omit<IContacts, B.IBaseReadonlyFields | ContactsRelationKey>;

export type IContactsUpdatable = Partial<
  Omit<IContacts, IContactsImmutableFields | ContactsRelationKey>
>;

export interface IContactsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ContactsSortableField = (typeof CONTACTS_SORTABLE_FIELDS)[number];

export type ContactsSearchableField = (typeof CONTACTS_SEARCHABLE_FIELDS)[number];

export type ContactsFilterableField = (typeof CONTACTS_FILTERABLE_FIELDS)[number];

export type ContactsDateRangeField = (typeof CONTACTS_DATE_RANGE_FIELDS)[number];

export type ContactsSelectableField = (typeof CONTACTS_SELECTABLE_FIELDS)[number];

export type ContactsDefaultSelectField = (typeof CONTACTS_DEFAULT_SELECT_FIELDS)[number];

export type ContactsEditableField = (typeof CONTACTS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IContactsAsOneRelationConfig = Q.IOneRelationConfig<
  "contacts",
  ContactsSelectableField
>;

export type IContactsAsManyRelationConfig = Q.IManyRelationConfig<
  "contacts",
  ContactsSelectableField,
  ContactsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IContactsAsOneRelationQuery = Q.IAsOneRelationQuery<IContacts, ContactsSelectableField>;

export type IContactsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IContacts,
  ContactsSelectableField,
  ContactsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IContactsRelationMap extends Record<ContactsRelationKey, unknown> {
  entity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  individual: IndividualsTypes.IIndividualsAsOneRelationQuery;
  kind: ValueTypes.IValueAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  visibility: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IContactsRelationQueries = Q.IBaseRelationQueries<
  IContacts,
  ContactsRelationKey,
  IContactsRelationMap
>;

export type IContactsItemQuery = Q.IBaseItemQuery<
  IContacts,
  ContactsRelationKey,
  ContactsSelectableField,
  ContactsRelationKey,
  ContactsSelectableField,
  IContactsRelationMap,
  IContactsRelationQueries
>;

export type IContactsListQuery = Q.IBaseListQuery<
  IContacts,
  ContactsRelationKey,
  ContactsSelectableField,
  ContactsSortableField,
  ContactsRelationKey,
  ContactsSelectableField,
  ContactsSortableField,
  ContactsDateRangeField,
  ContactsFilterableField,
  IContactsRelationMap,
  IContactsRelationQueries,
  IContactsItemQuery
>;
