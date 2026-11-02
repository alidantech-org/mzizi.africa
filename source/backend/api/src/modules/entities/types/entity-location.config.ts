// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as LegalEntityConfig from '#/modules/entities/types/legal-entity.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IEntityLocation,
  EntityLocationKey,
  EntityLocationRelationKey,
  EntityLocationSortableField,
  EntityLocationFilterableField,
  EntityLocationDateRangeField,
  EntityLocationSelectableField,
  IEntityLocationAsOneRelationConfig,
  IEntityLocationAsManyRelationConfig
} from './entity-location.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const ENTITY_LOCATION_RELATION_KEYS = ['legalEntity', ] as const satisfies readonly EntityLocationKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const ENTITY_LOCATION_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly EntityLocationKey[];

export const ENTITY_LOCATION_SEARCHABLE_FIELDS = [] as const satisfies readonly EntityLocationKey[];

export const ENTITY_LOCATION_FILTERABLE_FIELDS = ['entityId', 'geoUnitId', 'id', 'isCurrent', 'kindId', 'method', 'verificationState', 'version', ] as const satisfies readonly EntityLocationKey[];

export const ENTITY_LOCATION_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly EntityLocationKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const ENTITY_LOCATION_SELECTABLE_FIELDS = ['addressText', 'artifactChecksum', 'artifactId', 'confidence', 'createdAt', 'entityId', 'geoUnitId', 'id', 'isCurrent', 'kindId', 'licence', 'method', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly EntityLocationKey[];

export const ENTITY_LOCATION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly EntityLocationSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const ENTITY_LOCATION_EDITABLE_FIELDS = ['addressText', 'artifactChecksum', 'artifactId', 'confidence', 'entityId', 'geoUnitId', 'isCurrent', 'kindId', 'licence', 'method', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly EntityLocationKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const ENTITY_LOCATION_AS_ONE_RELATION_CONFIG = {
  relation: 'entityLocation',
  type: ERelationType.One,
  selectableFields: ENTITY_LOCATION_SELECTABLE_FIELDS,
  defaultSelectFields: ENTITY_LOCATION_DEFAULT_SELECT_FIELDS
} as const satisfies IEntityLocationAsOneRelationConfig;

export const ENTITY_LOCATION_AS_MANY_RELATION_CONFIG = {
  relation: 'entityLocations',
  type: ERelationType.Many,
  selectableFields: ENTITY_LOCATION_SELECTABLE_FIELDS,
  defaultSelectFields: ENTITY_LOCATION_DEFAULT_SELECT_FIELDS,
  sortableFields: ENTITY_LOCATION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IEntityLocationAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const ENTITY_LOCATION_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<EntityLocationRelationKey>().one(LegalEntityConfig.LEGAL_ENTITY_AS_ONE_RELATION_CONFIG, 'legalEntity'),
] as const;

export const ENTITY_LOCATION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const ENTITY_LOCATION_QUERY_OPTIONS = {
  searchableFields: ENTITY_LOCATION_SEARCHABLE_FIELDS,
  selectableFields: ENTITY_LOCATION_SELECTABLE_FIELDS,
  defaultSelectFields: ENTITY_LOCATION_DEFAULT_SELECT_FIELDS,
  sortableFields: ENTITY_LOCATION_SORTABLE_FIELDS,
  filterFields: ENTITY_LOCATION_FILTERABLE_FIELDS,
  dateRangeFields: ENTITY_LOCATION_DATE_RANGE_FIELDS,
  oneRelations: ENTITY_LOCATION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: ENTITY_LOCATION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IEntityLocation,
  EntityLocationSortableField,
  EntityLocationSelectableField,
  EntityLocationFilterableField,
  EntityLocationDateRangeField,
  EntityLocationRelationKey,
  typeof ENTITY_LOCATION_ONE_RELATION_QUERY_OPTIONS,
  typeof ENTITY_LOCATION_MANY_RELATION_QUERY_OPTIONS
>;