// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as AmenityTypes from '#/modules/services/types/amenity.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  AMENITY_OFFICE_RELATION_KEYS,
  AMENITY_OFFICE_SORTABLE_FIELDS,
  AMENITY_OFFICE_SEARCHABLE_FIELDS,
  AMENITY_OFFICE_FILTERABLE_FIELDS,
  AMENITY_OFFICE_DATE_RANGE_FIELDS,
  AMENITY_OFFICE_SELECTABLE_FIELDS,
  AMENITY_OFFICE_DEFAULT_SELECT_FIELDS,
  AMENITY_OFFICE_EDITABLE_FIELDS
} from './amenity-office.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Amenity Office */
export interface IAmenityOffice extends B.IBase {
  amenityId: string;
  isCurrent: boolean;
  officeId: string;
  roleKindId: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly amenity?: AmenityTypes.IAmenity;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type AmenityOfficeKey = keyof IAmenityOffice;

export type AmenityOfficeRelationKey = (typeof AMENITY_OFFICE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IAmenityOfficeReadonlyFields = B.IBaseReadonlyFields;

export type IAmenityOfficeContextualFields = never;

export type IAmenityOfficeSensitiveFields = never;

export type IAmenityOfficeTransitionFields = never;

export type IAmenityOfficeImmutableFields =
  | IAmenityOfficeReadonlyFields
  | IAmenityOfficeContextualFields
  | IAmenityOfficeSensitiveFields
  | IAmenityOfficeTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IAmenityOfficeCreatable = Omit<IAmenityOffice, IAmenityOfficeImmutableFields | AmenityOfficeRelationKey>;

export type IAmenityOfficeSystemWritable = Omit<IAmenityOffice, B.IBaseReadonlyFields | AmenityOfficeRelationKey>;

export type IAmenityOfficeUpdatable = Partial<Omit<IAmenityOffice, IAmenityOfficeImmutableFields | AmenityOfficeRelationKey>>;

export interface IAmenityOfficeTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type AmenityOfficeSortableField = (typeof AMENITY_OFFICE_SORTABLE_FIELDS)[number];

export type AmenityOfficeSearchableField = (typeof AMENITY_OFFICE_SEARCHABLE_FIELDS)[number];

export type AmenityOfficeFilterableField = (typeof AMENITY_OFFICE_FILTERABLE_FIELDS)[number];

export type AmenityOfficeDateRangeField = (typeof AMENITY_OFFICE_DATE_RANGE_FIELDS)[number];

export type AmenityOfficeSelectableField = (typeof AMENITY_OFFICE_SELECTABLE_FIELDS)[number];

export type AmenityOfficeDefaultSelectField = (typeof AMENITY_OFFICE_DEFAULT_SELECT_FIELDS)[number];

export type AmenityOfficeEditableField = (typeof AMENITY_OFFICE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IAmenityOfficeAsOneRelationConfig = Q.IOneRelationConfig<'amenityOffice', AmenityOfficeSelectableField>;

export type IAmenityOfficeAsManyRelationConfig = Q.IManyRelationConfig<'amenityOffices', AmenityOfficeSelectableField, AmenityOfficeSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IAmenityOfficeAsOneRelationQuery = Q.IAsOneRelationQuery<IAmenityOffice, AmenityOfficeSelectableField>;

export type IAmenityOfficeAsManyRelationQuery = Q.IAsManyRelationQuery<IAmenityOffice, AmenityOfficeSelectableField, AmenityOfficeSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IAmenityOfficeRelationMap extends Record<AmenityOfficeRelationKey, unknown> {
  amenity: AmenityTypes.IAmenityAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IAmenityOfficeRelationQueries = Q.IBaseRelationQueries<IAmenityOffice, AmenityOfficeRelationKey, IAmenityOfficeRelationMap>;

export type IAmenityOfficeItemQuery = Q.IBaseItemQuery<
  IAmenityOffice,
  AmenityOfficeRelationKey,
  AmenityOfficeSelectableField,
  AmenityOfficeRelationKey,
  AmenityOfficeSelectableField,
  IAmenityOfficeRelationMap,
  IAmenityOfficeRelationQueries
>;

export type IAmenityOfficeListQuery = Q.IBaseListQuery<
  IAmenityOffice,
  AmenityOfficeRelationKey,
  AmenityOfficeSelectableField,
  AmenityOfficeSortableField,
  AmenityOfficeRelationKey,
  AmenityOfficeSelectableField,
  AmenityOfficeSortableField,
  AmenityOfficeDateRangeField,
  AmenityOfficeFilterableField,
  IAmenityOfficeRelationMap,
  IAmenityOfficeRelationQueries,
  IAmenityOfficeItemQuery
>;