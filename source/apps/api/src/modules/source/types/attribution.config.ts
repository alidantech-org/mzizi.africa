// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as DocumentConfig from '#/modules/source/types/document.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IAttribution,
  AttributionKey,
  AttributionRelationKey,
  AttributionSortableField,
  AttributionFilterableField,
  AttributionDateRangeField,
  AttributionSelectableField,
  IAttributionAsOneRelationConfig,
  IAttributionAsManyRelationConfig
} from './attribution.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const ATTRIBUTION_RELATION_KEYS = ['document', ] as const satisfies readonly AttributionKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const ATTRIBUTION_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', ] as const satisfies readonly AttributionKey[];

export const ATTRIBUTION_SEARCHABLE_FIELDS = [] as const satisfies readonly AttributionKey[];

export const ATTRIBUTION_FILTERABLE_FIELDS = ['attributedBy', 'captureId', 'documentId', 'id', 'methodId', 'relation', 'targetId', 'targetKind', 'version', ] as const satisfies readonly AttributionKey[];

export const ATTRIBUTION_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly AttributionKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const ATTRIBUTION_SELECTABLE_FIELDS = ['attributedBy', 'captureId', 'confidence', 'createdAt', 'documentId', 'id', 'locator', 'methodId', 'relation', 'targetField', 'targetId', 'targetKind', 'updatedAt', ] as const satisfies readonly AttributionKey[];

export const ATTRIBUTION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly AttributionSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const ATTRIBUTION_EDITABLE_FIELDS = ['attributedBy', 'captureId', 'confidence', 'documentId', 'locator', 'methodId', 'relation', 'targetField', 'targetId', 'targetKind', ] as const satisfies readonly AttributionKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const ATTRIBUTION_AS_ONE_RELATION_CONFIG = {
  relation: 'attribution',
  type: ERelationType.One,
  selectableFields: ATTRIBUTION_SELECTABLE_FIELDS,
  defaultSelectFields: ATTRIBUTION_DEFAULT_SELECT_FIELDS
} as const satisfies IAttributionAsOneRelationConfig;

export const ATTRIBUTION_AS_MANY_RELATION_CONFIG = {
  relation: 'attributions',
  type: ERelationType.Many,
  selectableFields: ATTRIBUTION_SELECTABLE_FIELDS,
  defaultSelectFields: ATTRIBUTION_DEFAULT_SELECT_FIELDS,
  sortableFields: ATTRIBUTION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IAttributionAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const ATTRIBUTION_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<AttributionRelationKey>().one(DocumentConfig.DOCUMENT_AS_ONE_RELATION_CONFIG, 'document'),
] as const;

export const ATTRIBUTION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const ATTRIBUTION_QUERY_OPTIONS = {
  searchableFields: ATTRIBUTION_SEARCHABLE_FIELDS,
  selectableFields: ATTRIBUTION_SELECTABLE_FIELDS,
  defaultSelectFields: ATTRIBUTION_DEFAULT_SELECT_FIELDS,
  sortableFields: ATTRIBUTION_SORTABLE_FIELDS,
  filterFields: ATTRIBUTION_FILTERABLE_FIELDS,
  dateRangeFields: ATTRIBUTION_DATE_RANGE_FIELDS,
  oneRelations: ATTRIBUTION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: ATTRIBUTION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IAttribution,
  AttributionSortableField,
  AttributionSelectableField,
  AttributionFilterableField,
  AttributionDateRangeField,
  AttributionRelationKey,
  typeof ATTRIBUTION_ONE_RELATION_QUERY_OPTIONS,
  typeof ATTRIBUTION_MANY_RELATION_QUERY_OPTIONS
>;