// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IDomainZone,
  DomainZoneKey,
  DomainZoneRelationKey,
  DomainZoneSortableField,
  DomainZoneFilterableField,
  DomainZoneDateRangeField,
  DomainZoneSelectableField,
  IDomainZoneAsOneRelationConfig,
  IDomainZoneAsManyRelationConfig
} from './domain-zone.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const DOMAIN_ZONE_RELATION_KEYS = [] as const satisfies readonly DomainZoneKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const DOMAIN_ZONE_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', ] as const satisfies readonly DomainZoneKey[];

export const DOMAIN_ZONE_SEARCHABLE_FIELDS = [] as const satisfies readonly DomainZoneKey[];

export const DOMAIN_ZONE_FILTERABLE_FIELDS = ['id', 'suffix', 'version', ] as const satisfies readonly DomainZoneKey[];

export const DOMAIN_ZONE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly DomainZoneKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const DOMAIN_ZONE_SELECTABLE_FIELDS = ['createdAt', 'id', 'operator', 'parentSuffix', 'purpose', 'secondLevelOpen', 'suffix', 'updatedAt', ] as const satisfies readonly DomainZoneKey[];

export const DOMAIN_ZONE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly DomainZoneSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const DOMAIN_ZONE_EDITABLE_FIELDS = ['operator', 'parentSuffix', 'purpose', 'secondLevelOpen', 'suffix', ] as const satisfies readonly DomainZoneKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const DOMAIN_ZONE_AS_ONE_RELATION_CONFIG = {
  relation: 'domainZone',
  type: ERelationType.One,
  selectableFields: DOMAIN_ZONE_SELECTABLE_FIELDS,
  defaultSelectFields: DOMAIN_ZONE_DEFAULT_SELECT_FIELDS
} as const satisfies IDomainZoneAsOneRelationConfig;

export const DOMAIN_ZONE_AS_MANY_RELATION_CONFIG = {
  relation: 'domainZones',
  type: ERelationType.Many,
  selectableFields: DOMAIN_ZONE_SELECTABLE_FIELDS,
  defaultSelectFields: DOMAIN_ZONE_DEFAULT_SELECT_FIELDS,
  sortableFields: DOMAIN_ZONE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IDomainZoneAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const DOMAIN_ZONE_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const DOMAIN_ZONE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const DOMAIN_ZONE_QUERY_OPTIONS = {
  searchableFields: DOMAIN_ZONE_SEARCHABLE_FIELDS,
  selectableFields: DOMAIN_ZONE_SELECTABLE_FIELDS,
  defaultSelectFields: DOMAIN_ZONE_DEFAULT_SELECT_FIELDS,
  sortableFields: DOMAIN_ZONE_SORTABLE_FIELDS,
  filterFields: DOMAIN_ZONE_FILTERABLE_FIELDS,
  dateRangeFields: DOMAIN_ZONE_DATE_RANGE_FIELDS,
  oneRelations: DOMAIN_ZONE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: DOMAIN_ZONE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IDomainZone,
  DomainZoneSortableField,
  DomainZoneSelectableField,
  DomainZoneFilterableField,
  DomainZoneDateRangeField,
  DomainZoneRelationKey,
  typeof DOMAIN_ZONE_ONE_RELATION_QUERY_OPTIONS,
  typeof DOMAIN_ZONE_MANY_RELATION_QUERY_OPTIONS
>;