// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as SiteConfig from '#/modules/website/types/site.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IDocumentSighting,
  DocumentSightingKey,
  DocumentSightingRelationKey,
  DocumentSightingSortableField,
  DocumentSightingFilterableField,
  DocumentSightingDateRangeField,
  DocumentSightingSelectableField,
  IDocumentSightingAsOneRelationConfig,
  IDocumentSightingAsManyRelationConfig
} from './document-sighting.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const DOCUMENT_SIGHTING_RELATION_KEYS = ['site', ] as const satisfies readonly DocumentSightingKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const DOCUMENT_SIGHTING_SORTABLE_FIELDS = ['createdAt', 'seenAt', 'updatedAt', 'version', ] as const satisfies readonly DocumentSightingKey[];

export const DOCUMENT_SIGHTING_SEARCHABLE_FIELDS = [] as const satisfies readonly DocumentSightingKey[];

export const DOCUMENT_SIGHTING_FILTERABLE_FIELDS = ['captureId', 'contentHash', 'documentId', 'id', 'sectionLabel', 'siteId', 'structureVersionId', 'url', 'version', ] as const satisfies readonly DocumentSightingKey[];

export const DOCUMENT_SIGHTING_DATE_RANGE_FIELDS = ['createdAt', 'seenAt', 'updatedAt', ] as const satisfies readonly DocumentSightingKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const DOCUMENT_SIGHTING_SELECTABLE_FIELDS = ['captureId', 'contentHash', 'createdAt', 'depth', 'documentId', 'headers', 'httpStatus', 'id', 'pageUrl', 'ruleIndex', 'sectionLabel', 'seenAt', 'siteId', 'sizeBytes', 'structureVersionId', 'updatedAt', 'url', ] as const satisfies readonly DocumentSightingKey[];

export const DOCUMENT_SIGHTING_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly DocumentSightingSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const DOCUMENT_SIGHTING_EDITABLE_FIELDS = ['captureId', 'contentHash', 'depth', 'documentId', 'headers', 'httpStatus', 'pageUrl', 'ruleIndex', 'sectionLabel', 'seenAt', 'siteId', 'sizeBytes', 'structureVersionId', 'url', ] as const satisfies readonly DocumentSightingKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const DOCUMENT_SIGHTING_AS_ONE_RELATION_CONFIG = {
  relation: 'documentSighting',
  type: ERelationType.One,
  selectableFields: DOCUMENT_SIGHTING_SELECTABLE_FIELDS,
  defaultSelectFields: DOCUMENT_SIGHTING_DEFAULT_SELECT_FIELDS
} as const satisfies IDocumentSightingAsOneRelationConfig;

export const DOCUMENT_SIGHTING_AS_MANY_RELATION_CONFIG = {
  relation: 'documentSightings',
  type: ERelationType.Many,
  selectableFields: DOCUMENT_SIGHTING_SELECTABLE_FIELDS,
  defaultSelectFields: DOCUMENT_SIGHTING_DEFAULT_SELECT_FIELDS,
  sortableFields: DOCUMENT_SIGHTING_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IDocumentSightingAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const DOCUMENT_SIGHTING_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<DocumentSightingRelationKey>().one(SiteConfig.SITE_AS_ONE_RELATION_CONFIG, 'site'),
] as const;

export const DOCUMENT_SIGHTING_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const DOCUMENT_SIGHTING_QUERY_OPTIONS = {
  searchableFields: DOCUMENT_SIGHTING_SEARCHABLE_FIELDS,
  selectableFields: DOCUMENT_SIGHTING_SELECTABLE_FIELDS,
  defaultSelectFields: DOCUMENT_SIGHTING_DEFAULT_SELECT_FIELDS,
  sortableFields: DOCUMENT_SIGHTING_SORTABLE_FIELDS,
  filterFields: DOCUMENT_SIGHTING_FILTERABLE_FIELDS,
  dateRangeFields: DOCUMENT_SIGHTING_DATE_RANGE_FIELDS,
  oneRelations: DOCUMENT_SIGHTING_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: DOCUMENT_SIGHTING_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IDocumentSighting,
  DocumentSightingSortableField,
  DocumentSightingSelectableField,
  DocumentSightingFilterableField,
  DocumentSightingDateRangeField,
  DocumentSightingRelationKey,
  typeof DOCUMENT_SIGHTING_ONE_RELATION_QUERY_OPTIONS,
  typeof DOCUMENT_SIGHTING_MANY_RELATION_QUERY_OPTIONS
>;