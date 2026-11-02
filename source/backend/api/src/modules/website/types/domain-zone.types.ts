// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  DOMAIN_ZONE_RELATION_KEYS,
  DOMAIN_ZONE_SORTABLE_FIELDS,
  DOMAIN_ZONE_SEARCHABLE_FIELDS,
  DOMAIN_ZONE_FILTERABLE_FIELDS,
  DOMAIN_ZONE_DATE_RANGE_FIELDS,
  DOMAIN_ZONE_SELECTABLE_FIELDS,
  DOMAIN_ZONE_DEFAULT_SELECT_FIELDS,
  DOMAIN_ZONE_EDITABLE_FIELDS
} from './domain-zone.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Domain Zone */
export interface IDomainZone extends B.IBase {
  operator: string | null;
  parentSuffix: string | null;
  purpose: string | null;
  secondLevelOpen: boolean | null;
  suffix: string;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type DomainZoneKey = keyof IDomainZone;

export type DomainZoneRelationKey = (typeof DOMAIN_ZONE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IDomainZoneReadonlyFields = B.IBaseReadonlyFields;

export type IDomainZoneContextualFields = never;

export type IDomainZoneSensitiveFields = never;

export type IDomainZoneTransitionFields = never;

export type IDomainZoneImmutableFields =
  | IDomainZoneReadonlyFields
  | IDomainZoneContextualFields
  | IDomainZoneSensitiveFields
  | IDomainZoneTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IDomainZoneCreatable = Omit<IDomainZone, IDomainZoneImmutableFields | DomainZoneRelationKey>;

export type IDomainZoneSystemWritable = Omit<IDomainZone, B.IBaseReadonlyFields | DomainZoneRelationKey>;

export type IDomainZoneUpdatable = Partial<Omit<IDomainZone, IDomainZoneImmutableFields | DomainZoneRelationKey>>;

export interface IDomainZoneTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type DomainZoneSortableField = (typeof DOMAIN_ZONE_SORTABLE_FIELDS)[number];

export type DomainZoneSearchableField = (typeof DOMAIN_ZONE_SEARCHABLE_FIELDS)[number];

export type DomainZoneFilterableField = (typeof DOMAIN_ZONE_FILTERABLE_FIELDS)[number];

export type DomainZoneDateRangeField = (typeof DOMAIN_ZONE_DATE_RANGE_FIELDS)[number];

export type DomainZoneSelectableField = (typeof DOMAIN_ZONE_SELECTABLE_FIELDS)[number];

export type DomainZoneDefaultSelectField = (typeof DOMAIN_ZONE_DEFAULT_SELECT_FIELDS)[number];

export type DomainZoneEditableField = (typeof DOMAIN_ZONE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IDomainZoneAsOneRelationConfig = Q.IOneRelationConfig<'domainZone', DomainZoneSelectableField>;

export type IDomainZoneAsManyRelationConfig = Q.IManyRelationConfig<'domainZones', DomainZoneSelectableField, DomainZoneSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IDomainZoneAsOneRelationQuery = Q.IAsOneRelationQuery<IDomainZone, DomainZoneSelectableField>;

export type IDomainZoneAsManyRelationQuery = Q.IAsManyRelationQuery<IDomainZone, DomainZoneSelectableField, DomainZoneSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IDomainZoneRelationMap extends Record<DomainZoneRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IDomainZoneRelationQueries = Q.IBaseRelationQueries<IDomainZone, DomainZoneRelationKey, IDomainZoneRelationMap>;

export type IDomainZoneItemQuery = Q.IBaseItemQuery<
  IDomainZone,
  DomainZoneRelationKey,
  DomainZoneSelectableField,
  DomainZoneRelationKey,
  DomainZoneSelectableField,
  IDomainZoneRelationMap,
  IDomainZoneRelationQueries
>;

export type IDomainZoneListQuery = Q.IBaseListQuery<
  IDomainZone,
  DomainZoneRelationKey,
  DomainZoneSelectableField,
  DomainZoneSortableField,
  DomainZoneRelationKey,
  DomainZoneSelectableField,
  DomainZoneSortableField,
  DomainZoneDateRangeField,
  DomainZoneFilterableField,
  IDomainZoneRelationMap,
  IDomainZoneRelationQueries,
  IDomainZoneItemQuery
>;