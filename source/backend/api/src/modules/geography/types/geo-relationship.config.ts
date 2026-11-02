// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as GeoUnitConfig from '#/modules/geography/types/geo-unit.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IGeoRelationship,
  GeoRelationshipKey,
  GeoRelationshipRelationKey,
  GeoRelationshipSortableField,
  GeoRelationshipFilterableField,
  GeoRelationshipDateRangeField,
  GeoRelationshipSelectableField,
  IGeoRelationshipAsOneRelationConfig,
  IGeoRelationshipAsManyRelationConfig
} from './geo-relationship.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const GEO_RELATIONSHIP_RELATION_KEYS = ['geoUnit', ] as const satisfies readonly GeoRelationshipKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const GEO_RELATIONSHIP_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly GeoRelationshipKey[];

export const GEO_RELATIONSHIP_SEARCHABLE_FIELDS = [] as const satisfies readonly GeoRelationshipKey[];

export const GEO_RELATIONSHIP_FILTERABLE_FIELDS = ['childId', 'id', 'isCurrent', 'kind', 'method', 'parentId', 'verificationState', 'version', ] as const satisfies readonly GeoRelationshipKey[];

export const GEO_RELATIONSHIP_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly GeoRelationshipKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const GEO_RELATIONSHIP_SELECTABLE_FIELDS = ['artifactChecksum', 'artifactId', 'childId', 'confidence', 'createdAt', 'id', 'isCurrent', 'kind', 'licence', 'method', 'parentId', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly GeoRelationshipKey[];

export const GEO_RELATIONSHIP_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly GeoRelationshipSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const GEO_RELATIONSHIP_EDITABLE_FIELDS = ['artifactChecksum', 'artifactId', 'childId', 'confidence', 'isCurrent', 'kind', 'licence', 'method', 'parentId', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly GeoRelationshipKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const GEO_RELATIONSHIP_AS_ONE_RELATION_CONFIG = {
  relation: 'geoRelationship',
  type: ERelationType.One,
  selectableFields: GEO_RELATIONSHIP_SELECTABLE_FIELDS,
  defaultSelectFields: GEO_RELATIONSHIP_DEFAULT_SELECT_FIELDS
} as const satisfies IGeoRelationshipAsOneRelationConfig;

export const GEO_RELATIONSHIP_AS_MANY_RELATION_CONFIG = {
  relation: 'geoRelationships',
  type: ERelationType.Many,
  selectableFields: GEO_RELATIONSHIP_SELECTABLE_FIELDS,
  defaultSelectFields: GEO_RELATIONSHIP_DEFAULT_SELECT_FIELDS,
  sortableFields: GEO_RELATIONSHIP_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IGeoRelationshipAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const GEO_RELATIONSHIP_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<GeoRelationshipRelationKey>().one(GeoUnitConfig.GEO_UNIT_AS_ONE_RELATION_CONFIG, 'geoUnit'),
] as const;

export const GEO_RELATIONSHIP_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const GEO_RELATIONSHIP_QUERY_OPTIONS = {
  searchableFields: GEO_RELATIONSHIP_SEARCHABLE_FIELDS,
  selectableFields: GEO_RELATIONSHIP_SELECTABLE_FIELDS,
  defaultSelectFields: GEO_RELATIONSHIP_DEFAULT_SELECT_FIELDS,
  sortableFields: GEO_RELATIONSHIP_SORTABLE_FIELDS,
  filterFields: GEO_RELATIONSHIP_FILTERABLE_FIELDS,
  dateRangeFields: GEO_RELATIONSHIP_DATE_RANGE_FIELDS,
  oneRelations: GEO_RELATIONSHIP_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: GEO_RELATIONSHIP_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IGeoRelationship,
  GeoRelationshipSortableField,
  GeoRelationshipSelectableField,
  GeoRelationshipFilterableField,
  GeoRelationshipDateRangeField,
  GeoRelationshipRelationKey,
  typeof GEO_RELATIONSHIP_ONE_RELATION_QUERY_OPTIONS,
  typeof GEO_RELATIONSHIP_MANY_RELATION_QUERY_OPTIONS
>;