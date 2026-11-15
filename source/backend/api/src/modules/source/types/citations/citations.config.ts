// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as CapturesConfig from '#/modules/source/types/captures/captures.config';
import * as DocumentsConfig from '#/modules/source/types/documents/documents.config';
import * as EvidenceConfig from '#/modules/source/types/evidence/evidence.config';
import * as FileVersionsConfig from '#/modules/filesystem/types/file-versions/file-versions.config';
import * as ValueConfig from '#/modules/reference/types/value/value.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ICitations,
  CitationsKey,
  CitationsRelationKey,
  CitationsSortableField,
  CitationsFilterableField,
  CitationsDateRangeField,
  CitationsSelectableField,
  ICitationsAsOneRelationConfig,
  ICitationsAsManyRelationConfig
} from './citations.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const CITATIONS_RELATION_KEYS = ['capture', 'document', 'evidence', 'fileVersion', 'locatorKind', ] as const satisfies readonly CitationsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const CITATIONS_SORTABLE_FIELDS = [] as const satisfies readonly CitationsKey[];

export const CITATIONS_SEARCHABLE_FIELDS = [] as const satisfies readonly CitationsKey[];

export const CITATIONS_FILTERABLE_FIELDS = [] as const satisfies readonly CitationsKey[];

export const CITATIONS_DATE_RANGE_FIELDS = [] as const satisfies readonly CitationsKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const CITATIONS_SELECTABLE_FIELDS = ['captureId', 'createdAt', 'deletedAt', 'documentId', 'evidenceId', 'fileVersionId', 'id', 'locator', 'locatorKindId', 'quotedHash', 'recordedAt', 'updatedAt', 'version', ] as const satisfies readonly CitationsKey[];

export const CITATIONS_DEFAULT_SELECT_FIELDS = ['captureId', 'createdAt', 'deletedAt', 'documentId', 'evidenceId', 'fileVersionId', 'id', 'locator', 'locatorKindId', 'quotedHash', 'recordedAt', 'updatedAt', 'version', ] as const satisfies readonly CitationsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const CITATIONS_EDITABLE_FIELDS = ['captureId', 'documentId', 'evidenceId', 'fileVersionId', 'locator', 'locatorKindId', 'quotedHash', 'recordedAt', ] as const satisfies readonly CitationsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const CITATIONS_AS_ONE_RELATION_CONFIG = {
  relation: 'citations',
  type: ERelationType.One,
  selectableFields: CITATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: CITATIONS_DEFAULT_SELECT_FIELDS
} as const satisfies ICitationsAsOneRelationConfig;

export const CITATIONS_AS_MANY_RELATION_CONFIG = {
  relation: 'citationss',
  type: ERelationType.Many,
  selectableFields: CITATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: CITATIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: CITATIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ICitationsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const CITATIONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<CitationsRelationKey>().one(CapturesConfig.CAPTURES_AS_ONE_RELATION_CONFIG, 'capture'),
  Q.createRelationKeyMapper<CitationsRelationKey>().one(DocumentsConfig.DOCUMENTS_AS_ONE_RELATION_CONFIG, 'document'),
  Q.createRelationKeyMapper<CitationsRelationKey>().one(EvidenceConfig.EVIDENCE_AS_ONE_RELATION_CONFIG, 'evidence'),
  Q.createRelationKeyMapper<CitationsRelationKey>().one(FileVersionsConfig.FILE_VERSIONS_AS_ONE_RELATION_CONFIG, 'fileVersion'),
  Q.createRelationKeyMapper<CitationsRelationKey>().one(ValueConfig.VALUE_AS_ONE_RELATION_CONFIG, 'locatorKind'),
] as const;

export const CITATIONS_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const CITATIONS_QUERY_OPTIONS = {
  searchableFields: CITATIONS_SEARCHABLE_FIELDS,
  selectableFields: CITATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: CITATIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: CITATIONS_SORTABLE_FIELDS,
  filterFields: CITATIONS_FILTERABLE_FIELDS,
  dateRangeFields: CITATIONS_DATE_RANGE_FIELDS,
  oneRelations: CITATIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: CITATIONS_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ICitations,
  CitationsSortableField,
  CitationsSelectableField,
  CitationsFilterableField,
  CitationsDateRangeField,
  CitationsRelationKey,
  typeof CITATIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof CITATIONS_MANY_RELATION_QUERY_OPTIONS
>;