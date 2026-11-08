// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { ContactChannel } from '#/types/contact/contact-channel.enum';
import type { ContactVisibility } from '#/types/contact/contact-visibility.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  CONTACT_POINT_RELATION_KEYS,
  CONTACT_POINT_SORTABLE_FIELDS,
  CONTACT_POINT_SEARCHABLE_FIELDS,
  CONTACT_POINT_FILTERABLE_FIELDS,
  CONTACT_POINT_DATE_RANGE_FIELDS,
  CONTACT_POINT_SELECTABLE_FIELDS,
  CONTACT_POINT_DEFAULT_SELECT_FIELDS,
  CONTACT_POINT_EDITABLE_FIELDS
} from './contact-point.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Contact Point */
export interface IContactPoint extends B.IBase {
  channel: ContactChannel;
  isCurrent: boolean;
  label: string | null;
  scopeId: string;
  scopeKind: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  value: string;
  visibility: ContactVisibility;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ContactPointKey = keyof IContactPoint;

export type ContactPointRelationKey = (typeof CONTACT_POINT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IContactPointReadonlyFields = B.IBaseReadonlyFields;

export type IContactPointContextualFields = never;

export type IContactPointSensitiveFields = never;

export type IContactPointTransitionFields = never;

export type IContactPointImmutableFields =
  | IContactPointReadonlyFields
  | IContactPointContextualFields
  | IContactPointSensitiveFields
  | IContactPointTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IContactPointCreatable = Omit<IContactPoint, IContactPointImmutableFields | ContactPointRelationKey>;

export type IContactPointSystemWritable = Omit<IContactPoint, B.IBaseReadonlyFields | ContactPointRelationKey>;

export type IContactPointUpdatable = Partial<Omit<IContactPoint, IContactPointImmutableFields | ContactPointRelationKey>>;

export interface IContactPointTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ContactPointSortableField = (typeof CONTACT_POINT_SORTABLE_FIELDS)[number];

export type ContactPointSearchableField = (typeof CONTACT_POINT_SEARCHABLE_FIELDS)[number];

export type ContactPointFilterableField = (typeof CONTACT_POINT_FILTERABLE_FIELDS)[number];

export type ContactPointDateRangeField = (typeof CONTACT_POINT_DATE_RANGE_FIELDS)[number];

export type ContactPointSelectableField = (typeof CONTACT_POINT_SELECTABLE_FIELDS)[number];

export type ContactPointDefaultSelectField = (typeof CONTACT_POINT_DEFAULT_SELECT_FIELDS)[number];

export type ContactPointEditableField = (typeof CONTACT_POINT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IContactPointAsOneRelationConfig = Q.IOneRelationConfig<'contactPoint', ContactPointSelectableField>;

export type IContactPointAsManyRelationConfig = Q.IManyRelationConfig<'contactPoints', ContactPointSelectableField, ContactPointSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IContactPointAsOneRelationQuery = Q.IAsOneRelationQuery<IContactPoint, ContactPointSelectableField>;

export type IContactPointAsManyRelationQuery = Q.IAsManyRelationQuery<IContactPoint, ContactPointSelectableField, ContactPointSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IContactPointRelationMap extends Record<ContactPointRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IContactPointRelationQueries = Q.IBaseRelationQueries<IContactPoint, ContactPointRelationKey, IContactPointRelationMap>;

export type IContactPointItemQuery = Q.IBaseItemQuery<
  IContactPoint,
  ContactPointRelationKey,
  ContactPointSelectableField,
  ContactPointRelationKey,
  ContactPointSelectableField,
  IContactPointRelationMap,
  IContactPointRelationQueries
>;

export type IContactPointListQuery = Q.IBaseListQuery<
  IContactPoint,
  ContactPointRelationKey,
  ContactPointSelectableField,
  ContactPointSortableField,
  ContactPointRelationKey,
  ContactPointSelectableField,
  ContactPointSortableField,
  ContactPointDateRangeField,
  ContactPointFilterableField,
  IContactPointRelationMap,
  IContactPointRelationQueries,
  IContactPointItemQuery
>;