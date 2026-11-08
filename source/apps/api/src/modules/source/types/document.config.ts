// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as PublisherConfig from '#/modules/source/types/publisher.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IDocument,
  DocumentKey,
  DocumentRelationKey,
  DocumentSortableField,
  DocumentFilterableField,
  DocumentDateRangeField,
  DocumentSelectableField,
  IDocumentAsOneRelationConfig,
  IDocumentAsManyRelationConfig
} from './document.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const DOCUMENT_RELATION_KEYS = ['publisher', ] as const satisfies readonly DocumentKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const DOCUMENT_SORTABLE_FIELDS = ['createdAt', 'publishedOn', 'title', 'updatedAt', 'version', ] as const satisfies readonly DocumentKey[];

export const DOCUMENT_SEARCHABLE_FIELDS = ['title', ] as const satisfies readonly DocumentKey[];

export const DOCUMENT_FILTERABLE_FIELDS = ['id', 'jurisdictionId', 'kindId', 'publisherId', 'siteId', 'title', 'version', ] as const satisfies readonly DocumentKey[];

export const DOCUMENT_DATE_RANGE_FIELDS = ['createdAt', 'publishedOn', 'updatedAt', ] as const satisfies readonly DocumentKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const DOCUMENT_SELECTABLE_FIELDS = ['citation', 'createdAt', 'id', 'jurisdictionId', 'kindId', 'language', 'licence', 'publishedOn', 'publishedOnPrecision', 'publisherId', 'siteId', 'title', 'updatedAt', 'url', ] as const satisfies readonly DocumentKey[];

export const DOCUMENT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly DocumentSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const DOCUMENT_EDITABLE_FIELDS = ['citation', 'jurisdictionId', 'kindId', 'language', 'licence', 'publishedOn', 'publishedOnPrecision', 'publisherId', 'siteId', 'title', 'url', ] as const satisfies readonly DocumentKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const DOCUMENT_AS_ONE_RELATION_CONFIG = {
  relation: 'document',
  type: ERelationType.One,
  selectableFields: DOCUMENT_SELECTABLE_FIELDS,
  defaultSelectFields: DOCUMENT_DEFAULT_SELECT_FIELDS
} as const satisfies IDocumentAsOneRelationConfig;

export const DOCUMENT_AS_MANY_RELATION_CONFIG = {
  relation: 'documents',
  type: ERelationType.Many,
  selectableFields: DOCUMENT_SELECTABLE_FIELDS,
  defaultSelectFields: DOCUMENT_DEFAULT_SELECT_FIELDS,
  sortableFields: DOCUMENT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IDocumentAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const DOCUMENT_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<DocumentRelationKey>().one(PublisherConfig.PUBLISHER_AS_ONE_RELATION_CONFIG, 'publisher'),
] as const;

export const DOCUMENT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const DOCUMENT_QUERY_OPTIONS = {
  searchableFields: DOCUMENT_SEARCHABLE_FIELDS,
  selectableFields: DOCUMENT_SELECTABLE_FIELDS,
  defaultSelectFields: DOCUMENT_DEFAULT_SELECT_FIELDS,
  sortableFields: DOCUMENT_SORTABLE_FIELDS,
  filterFields: DOCUMENT_FILTERABLE_FIELDS,
  dateRangeFields: DOCUMENT_DATE_RANGE_FIELDS,
  oneRelations: DOCUMENT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: DOCUMENT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IDocument,
  DocumentSortableField,
  DocumentSelectableField,
  DocumentFilterableField,
  DocumentDateRangeField,
  DocumentRelationKey,
  typeof DOCUMENT_ONE_RELATION_QUERY_OPTIONS,
  typeof DOCUMENT_MANY_RELATION_QUERY_OPTIONS
>;