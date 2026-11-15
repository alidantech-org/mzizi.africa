// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ValueConfig from '#/modules/reference/types/value/value.config';
import * as PublishersConfig from '#/modules/source/types/publishers/publishers.config';
import * as SourcesConfig from '#/modules/source/types/sources/sources.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IDocuments,
  DocumentsKey,
  DocumentsRelationKey,
  DocumentsSortableField,
  DocumentsFilterableField,
  DocumentsDateRangeField,
  DocumentsSelectableField,
  IDocumentsAsOneRelationConfig,
  IDocumentsAsManyRelationConfig
} from './documents.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const DOCUMENTS_RELATION_KEYS = ['kind', 'publisher', 'source', ] as const satisfies readonly DocumentsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const DOCUMENTS_SORTABLE_FIELDS = [] as const satisfies readonly DocumentsKey[];

export const DOCUMENTS_SEARCHABLE_FIELDS = [] as const satisfies readonly DocumentsKey[];

export const DOCUMENTS_FILTERABLE_FIELDS = [] as const satisfies readonly DocumentsKey[];

export const DOCUMENTS_DATE_RANGE_FIELDS = [] as const satisfies readonly DocumentsKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const DOCUMENTS_SELECTABLE_FIELDS = ['canonicalUrl', 'code', 'createdAt', 'deletedAt', 'id', 'kindId', 'publishedOn', 'publisherId', 'sourceId', 'title', 'updatedAt', 'version', ] as const satisfies readonly DocumentsKey[];

export const DOCUMENTS_DEFAULT_SELECT_FIELDS = ['canonicalUrl', 'code', 'createdAt', 'deletedAt', 'id', 'kindId', 'publishedOn', 'publisherId', 'sourceId', 'title', 'updatedAt', 'version', ] as const satisfies readonly DocumentsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const DOCUMENTS_EDITABLE_FIELDS = ['canonicalUrl', 'code', 'kindId', 'publishedOn', 'publisherId', 'sourceId', 'title', ] as const satisfies readonly DocumentsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const DOCUMENTS_AS_ONE_RELATION_CONFIG = {
  relation: 'documents',
  type: ERelationType.One,
  selectableFields: DOCUMENTS_SELECTABLE_FIELDS,
  defaultSelectFields: DOCUMENTS_DEFAULT_SELECT_FIELDS
} as const satisfies IDocumentsAsOneRelationConfig;

export const DOCUMENTS_AS_MANY_RELATION_CONFIG = {
  relation: 'documentss',
  type: ERelationType.Many,
  selectableFields: DOCUMENTS_SELECTABLE_FIELDS,
  defaultSelectFields: DOCUMENTS_DEFAULT_SELECT_FIELDS,
  sortableFields: DOCUMENTS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IDocumentsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const DOCUMENTS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<DocumentsRelationKey>().one(ValueConfig.VALUE_AS_ONE_RELATION_CONFIG, 'kind'),
  Q.createRelationKeyMapper<DocumentsRelationKey>().one(PublishersConfig.PUBLISHERS_AS_ONE_RELATION_CONFIG, 'publisher'),
  Q.createRelationKeyMapper<DocumentsRelationKey>().one(SourcesConfig.SOURCES_AS_ONE_RELATION_CONFIG, 'source'),
] as const;

export const DOCUMENTS_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const DOCUMENTS_QUERY_OPTIONS = {
  searchableFields: DOCUMENTS_SEARCHABLE_FIELDS,
  selectableFields: DOCUMENTS_SELECTABLE_FIELDS,
  defaultSelectFields: DOCUMENTS_DEFAULT_SELECT_FIELDS,
  sortableFields: DOCUMENTS_SORTABLE_FIELDS,
  filterFields: DOCUMENTS_FILTERABLE_FIELDS,
  dateRangeFields: DOCUMENTS_DATE_RANGE_FIELDS,
  oneRelations: DOCUMENTS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: DOCUMENTS_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IDocuments,
  DocumentsSortableField,
  DocumentsSelectableField,
  DocumentsFilterableField,
  DocumentsDateRangeField,
  DocumentsRelationKey,
  typeof DOCUMENTS_ONE_RELATION_QUERY_OPTIONS,
  typeof DOCUMENTS_MANY_RELATION_QUERY_OPTIONS
>;