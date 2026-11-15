// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import { ERelationType } from '#/modules/common/schema/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as DocumentsConfig from '#/modules/source/schema/types/documents/documents.config';
import * as FileVersionsConfig from '#/modules/filesystem/schema/types/file-versions/file-versions.config';
import * as ManifestReleasesConfig from '#/modules/source/schema/types/manifest-releases/manifest-releases.config';
import * as SourcesConfig from '#/modules/source/schema/types/sources/sources.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ICaptures,
  CapturesKey,
  CapturesRelationKey,
  CapturesSortableField,
  CapturesFilterableField,
  CapturesDateRangeField,
  CapturesSelectableField,
  ICapturesAsOneRelationConfig,
  ICapturesAsManyRelationConfig
} from './captures.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const CAPTURES_RELATION_KEYS = ['document', 'fileVersion', 'manifestRelease', 'source', ] as const satisfies readonly CapturesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const CAPTURES_SORTABLE_FIELDS = [] as const satisfies readonly CapturesKey[];

export const CAPTURES_SEARCHABLE_FIELDS = [] as const satisfies readonly CapturesKey[];

export const CAPTURES_FILTERABLE_FIELDS = [] as const satisfies readonly CapturesKey[];

export const CAPTURES_DATE_RANGE_FIELDS = [] as const satisfies readonly CapturesKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const CAPTURES_SELECTABLE_FIELDS = ['contentHash', 'createdAt', 'deletedAt', 'documentId', 'fileVersionId', 'id', 'manifestReleaseId', 'responseMetadata', 'retrievedAt', 'retrievedUrl', 'sourceId', 'updatedAt', 'version', ] as const satisfies readonly CapturesKey[];

export const CAPTURES_DEFAULT_SELECT_FIELDS = ['contentHash', 'createdAt', 'deletedAt', 'documentId', 'fileVersionId', 'id', 'manifestReleaseId', 'responseMetadata', 'retrievedAt', 'retrievedUrl', 'sourceId', 'updatedAt', 'version', ] as const satisfies readonly CapturesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const CAPTURES_EDITABLE_FIELDS = ['contentHash', 'documentId', 'fileVersionId', 'manifestReleaseId', 'responseMetadata', 'retrievedAt', 'retrievedUrl', 'sourceId', ] as const satisfies readonly CapturesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const CAPTURES_AS_ONE_RELATION_CONFIG = {
  relation: 'captures',
  type: ERelationType.One,
  selectableFields: CAPTURES_SELECTABLE_FIELDS,
  defaultSelectFields: CAPTURES_DEFAULT_SELECT_FIELDS
} as const satisfies ICapturesAsOneRelationConfig;

export const CAPTURES_AS_MANY_RELATION_CONFIG = {
  relation: 'capturess',
  type: ERelationType.Many,
  selectableFields: CAPTURES_SELECTABLE_FIELDS,
  defaultSelectFields: CAPTURES_DEFAULT_SELECT_FIELDS,
  sortableFields: CAPTURES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ICapturesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const CAPTURES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<CapturesRelationKey>().one(DocumentsConfig.DOCUMENTS_AS_ONE_RELATION_CONFIG, 'document'),
  Q.createRelationKeyMapper<CapturesRelationKey>().one(FileVersionsConfig.FILE_VERSIONS_AS_ONE_RELATION_CONFIG, 'fileVersion'),
  Q.createRelationKeyMapper<CapturesRelationKey>().one(ManifestReleasesConfig.MANIFEST_RELEASES_AS_ONE_RELATION_CONFIG, 'manifestRelease'),
  Q.createRelationKeyMapper<CapturesRelationKey>().one(SourcesConfig.SOURCES_AS_ONE_RELATION_CONFIG, 'source'),
] as const;

export const CAPTURES_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const CAPTURES_QUERY_OPTIONS = {
  searchableFields: CAPTURES_SEARCHABLE_FIELDS,
  selectableFields: CAPTURES_SELECTABLE_FIELDS,
  defaultSelectFields: CAPTURES_DEFAULT_SELECT_FIELDS,
  sortableFields: CAPTURES_SORTABLE_FIELDS,
  filterFields: CAPTURES_FILTERABLE_FIELDS,
  dateRangeFields: CAPTURES_DATE_RANGE_FIELDS,
  oneRelations: CAPTURES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: CAPTURES_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ICaptures,
  CapturesSortableField,
  CapturesSelectableField,
  CapturesFilterableField,
  CapturesDateRangeField,
  CapturesRelationKey,
  typeof CAPTURES_ONE_RELATION_QUERY_OPTIONS,
  typeof CAPTURES_MANY_RELATION_QUERY_OPTIONS
>;