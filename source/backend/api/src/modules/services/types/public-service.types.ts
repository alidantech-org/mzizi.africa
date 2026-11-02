// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PUBLIC_SERVICE_RELATION_KEYS,
  PUBLIC_SERVICE_SORTABLE_FIELDS,
  PUBLIC_SERVICE_SEARCHABLE_FIELDS,
  PUBLIC_SERVICE_FILTERABLE_FIELDS,
  PUBLIC_SERVICE_DATE_RANGE_FIELDS,
  PUBLIC_SERVICE_SELECTABLE_FIELDS,
  PUBLIC_SERVICE_DEFAULT_SELECT_FIELDS,
  PUBLIC_SERVICE_EDITABLE_FIELDS
} from './public-service.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Public Service */
export interface IPublicService extends B.IBase {
  code: string;
  description: string | null;
  isCurrent: boolean;
  jurisdictionId: string;
  legalBasisId: string | null;
  name: string;
  sectorId: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PublicServiceKey = keyof IPublicService;

export type PublicServiceRelationKey = (typeof PUBLIC_SERVICE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPublicServiceReadonlyFields = B.IBaseReadonlyFields;

export type IPublicServiceContextualFields = never;

export type IPublicServiceSensitiveFields = never;

export type IPublicServiceTransitionFields = never;

export type IPublicServiceImmutableFields =
  | IPublicServiceReadonlyFields
  | IPublicServiceContextualFields
  | IPublicServiceSensitiveFields
  | IPublicServiceTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPublicServiceCreatable = Omit<IPublicService, IPublicServiceImmutableFields | PublicServiceRelationKey>;

export type IPublicServiceSystemWritable = Omit<IPublicService, B.IBaseReadonlyFields | PublicServiceRelationKey>;

export type IPublicServiceUpdatable = Partial<Omit<IPublicService, IPublicServiceImmutableFields | PublicServiceRelationKey>>;

export interface IPublicServiceTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PublicServiceSortableField = (typeof PUBLIC_SERVICE_SORTABLE_FIELDS)[number];

export type PublicServiceSearchableField = (typeof PUBLIC_SERVICE_SEARCHABLE_FIELDS)[number];

export type PublicServiceFilterableField = (typeof PUBLIC_SERVICE_FILTERABLE_FIELDS)[number];

export type PublicServiceDateRangeField = (typeof PUBLIC_SERVICE_DATE_RANGE_FIELDS)[number];

export type PublicServiceSelectableField = (typeof PUBLIC_SERVICE_SELECTABLE_FIELDS)[number];

export type PublicServiceDefaultSelectField = (typeof PUBLIC_SERVICE_DEFAULT_SELECT_FIELDS)[number];

export type PublicServiceEditableField = (typeof PUBLIC_SERVICE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPublicServiceAsOneRelationConfig = Q.IOneRelationConfig<'publicService', PublicServiceSelectableField>;

export type IPublicServiceAsManyRelationConfig = Q.IManyRelationConfig<'publicServices', PublicServiceSelectableField, PublicServiceSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPublicServiceAsOneRelationQuery = Q.IAsOneRelationQuery<IPublicService, PublicServiceSelectableField>;

export type IPublicServiceAsManyRelationQuery = Q.IAsManyRelationQuery<IPublicService, PublicServiceSelectableField, PublicServiceSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPublicServiceRelationMap extends Record<PublicServiceRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPublicServiceRelationQueries = Q.IBaseRelationQueries<IPublicService, PublicServiceRelationKey, IPublicServiceRelationMap>;

export type IPublicServiceItemQuery = Q.IBaseItemQuery<
  IPublicService,
  PublicServiceRelationKey,
  PublicServiceSelectableField,
  PublicServiceRelationKey,
  PublicServiceSelectableField,
  IPublicServiceRelationMap,
  IPublicServiceRelationQueries
>;

export type IPublicServiceListQuery = Q.IBaseListQuery<
  IPublicService,
  PublicServiceRelationKey,
  PublicServiceSelectableField,
  PublicServiceSortableField,
  PublicServiceRelationKey,
  PublicServiceSelectableField,
  PublicServiceSortableField,
  PublicServiceDateRangeField,
  PublicServiceFilterableField,
  IPublicServiceRelationMap,
  IPublicServiceRelationQueries,
  IPublicServiceItemQuery
>;