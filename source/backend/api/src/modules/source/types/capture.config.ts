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
  ICapture,
  CaptureKey,
  CaptureRelationKey,
  CaptureSortableField,
  CaptureFilterableField,
  CaptureDateRangeField,
  CaptureSelectableField,
  ICaptureAsOneRelationConfig,
  ICaptureAsManyRelationConfig
} from './capture.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const CAPTURE_RELATION_KEYS = ['document', ] as const satisfies readonly CaptureKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const CAPTURE_SORTABLE_FIELDS = ['createdAt', 'retrievedAt', 'updatedAt', 'version', ] as const satisfies readonly CaptureKey[];

export const CAPTURE_SEARCHABLE_FIELDS = [] as const satisfies readonly CaptureKey[];

export const CAPTURE_FILTERABLE_FIELDS = ['documentId', 'domainId', 'familyVersionId', 'fileVersionId', 'id', 'retrievedBy', 'siteId', 'structureVersionId', 'version', ] as const satisfies readonly CaptureKey[];

export const CAPTURE_DATE_RANGE_FIELDS = ['createdAt', 'retrievedAt', 'updatedAt', ] as const satisfies readonly CaptureKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const CAPTURE_SELECTABLE_FIELDS = ['contentHash', 'createdAt', 'documentId', 'domainId', 'familyVersionId', 'fileVersionId', 'httpStatus', 'id', 'retrievedAt', 'retrievedBy', 'retrievedUrl', 'siteId', 'structureVersionId', 'tool', 'updatedAt', ] as const satisfies readonly CaptureKey[];

export const CAPTURE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly CaptureSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const CAPTURE_EDITABLE_FIELDS = ['contentHash', 'documentId', 'domainId', 'familyVersionId', 'fileVersionId', 'httpStatus', 'retrievedAt', 'retrievedBy', 'retrievedUrl', 'siteId', 'structureVersionId', 'tool', ] as const satisfies readonly CaptureKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const CAPTURE_AS_ONE_RELATION_CONFIG = {
  relation: 'capture',
  type: ERelationType.One,
  selectableFields: CAPTURE_SELECTABLE_FIELDS,
  defaultSelectFields: CAPTURE_DEFAULT_SELECT_FIELDS
} as const satisfies ICaptureAsOneRelationConfig;

export const CAPTURE_AS_MANY_RELATION_CONFIG = {
  relation: 'captures',
  type: ERelationType.Many,
  selectableFields: CAPTURE_SELECTABLE_FIELDS,
  defaultSelectFields: CAPTURE_DEFAULT_SELECT_FIELDS,
  sortableFields: CAPTURE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ICaptureAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const CAPTURE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<CaptureRelationKey>().one(DocumentConfig.DOCUMENT_AS_ONE_RELATION_CONFIG, 'document'),
] as const;

export const CAPTURE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const CAPTURE_QUERY_OPTIONS = {
  searchableFields: CAPTURE_SEARCHABLE_FIELDS,
  selectableFields: CAPTURE_SELECTABLE_FIELDS,
  defaultSelectFields: CAPTURE_DEFAULT_SELECT_FIELDS,
  sortableFields: CAPTURE_SORTABLE_FIELDS,
  filterFields: CAPTURE_FILTERABLE_FIELDS,
  dateRangeFields: CAPTURE_DATE_RANGE_FIELDS,
  oneRelations: CAPTURE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: CAPTURE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ICapture,
  CaptureSortableField,
  CaptureSelectableField,
  CaptureFilterableField,
  CaptureDateRangeField,
  CaptureRelationKey,
  typeof CAPTURE_ONE_RELATION_QUERY_OPTIONS,
  typeof CAPTURE_MANY_RELATION_QUERY_OPTIONS
>;