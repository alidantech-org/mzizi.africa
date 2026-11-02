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
  IDocumentClassification,
  DocumentClassificationKey,
  DocumentClassificationRelationKey,
  DocumentClassificationSortableField,
  DocumentClassificationFilterableField,
  DocumentClassificationDateRangeField,
  DocumentClassificationSelectableField,
  IDocumentClassificationAsOneRelationConfig,
  IDocumentClassificationAsManyRelationConfig
} from './document-classification.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const DOCUMENT_CLASSIFICATION_RELATION_KEYS = [] as const satisfies readonly DocumentClassificationKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const DOCUMENT_CLASSIFICATION_SORTABLE_FIELDS = ['classifiedAt', 'createdAt', 'updatedAt', 'version', ] as const satisfies readonly DocumentClassificationKey[];

export const DOCUMENT_CLASSIFICATION_SEARCHABLE_FIELDS = [] as const satisfies readonly DocumentClassificationKey[];

export const DOCUMENT_CLASSIFICATION_FILTERABLE_FIELDS = ['classifierVersion', 'documentId', 'id', 'kind', 'method', 'routeStatus', 'version', ] as const satisfies readonly DocumentClassificationKey[];

export const DOCUMENT_CLASSIFICATION_DATE_RANGE_FIELDS = ['classifiedAt', 'createdAt', 'updatedAt', ] as const satisfies readonly DocumentClassificationKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const DOCUMENT_CLASSIFICATION_SELECTABLE_FIELDS = ['classifiedAt', 'classifierVersion', 'createdAt', 'documentId', 'evidence', 'facts', 'id', 'kind', 'method', 'routeParser', 'routeStatus', 'score', 'updatedAt', ] as const satisfies readonly DocumentClassificationKey[];

export const DOCUMENT_CLASSIFICATION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly DocumentClassificationSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const DOCUMENT_CLASSIFICATION_EDITABLE_FIELDS = ['classifiedAt', 'classifierVersion', 'documentId', 'evidence', 'facts', 'kind', 'method', 'routeParser', 'routeStatus', 'score', ] as const satisfies readonly DocumentClassificationKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const DOCUMENT_CLASSIFICATION_AS_ONE_RELATION_CONFIG = {
  relation: 'documentClassification',
  type: ERelationType.One,
  selectableFields: DOCUMENT_CLASSIFICATION_SELECTABLE_FIELDS,
  defaultSelectFields: DOCUMENT_CLASSIFICATION_DEFAULT_SELECT_FIELDS
} as const satisfies IDocumentClassificationAsOneRelationConfig;

export const DOCUMENT_CLASSIFICATION_AS_MANY_RELATION_CONFIG = {
  relation: 'documentClassifications',
  type: ERelationType.Many,
  selectableFields: DOCUMENT_CLASSIFICATION_SELECTABLE_FIELDS,
  defaultSelectFields: DOCUMENT_CLASSIFICATION_DEFAULT_SELECT_FIELDS,
  sortableFields: DOCUMENT_CLASSIFICATION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IDocumentClassificationAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const DOCUMENT_CLASSIFICATION_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const DOCUMENT_CLASSIFICATION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const DOCUMENT_CLASSIFICATION_QUERY_OPTIONS = {
  searchableFields: DOCUMENT_CLASSIFICATION_SEARCHABLE_FIELDS,
  selectableFields: DOCUMENT_CLASSIFICATION_SELECTABLE_FIELDS,
  defaultSelectFields: DOCUMENT_CLASSIFICATION_DEFAULT_SELECT_FIELDS,
  sortableFields: DOCUMENT_CLASSIFICATION_SORTABLE_FIELDS,
  filterFields: DOCUMENT_CLASSIFICATION_FILTERABLE_FIELDS,
  dateRangeFields: DOCUMENT_CLASSIFICATION_DATE_RANGE_FIELDS,
  oneRelations: DOCUMENT_CLASSIFICATION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: DOCUMENT_CLASSIFICATION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IDocumentClassification,
  DocumentClassificationSortableField,
  DocumentClassificationSelectableField,
  DocumentClassificationFilterableField,
  DocumentClassificationDateRangeField,
  DocumentClassificationRelationKey,
  typeof DOCUMENT_CLASSIFICATION_ONE_RELATION_QUERY_OPTIONS,
  typeof DOCUMENT_CLASSIFICATION_MANY_RELATION_QUERY_OPTIONS
>;