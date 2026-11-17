// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as CapturesConfig from "#/modules/source/schema/types/captures/captures.config";
import * as DocumentsConfig from "#/modules/source/schema/types/documents/documents.config";
import * as EvidenceConfig from "#/modules/source/schema/types/evidence/evidence.config";
import * as FileVersionsConfig from "#/modules/filesystem/schema/types/file-versions/file-versions.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";

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
  ICitationsAsManyRelationConfig,
} from "./citations.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const CITATIONS_RELATION_KEYS = [
  "capture",
  "document",
  "evidence",
  "fileVersion",
  "locatorKind",
] as const satisfies readonly CitationsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const CITATIONS_SORTABLE_FIELDS = [
  "captureId",
  "code",
  "createdAt",
  "deletedAt",
  "documentId",
  "evidenceId",
  "fileVersionId",
  "id",
  "locator",
  "locatorKindId",
  "quotedHash",
  "recordedAt",
  "updatedAt",
  "version",
] as const satisfies readonly CitationsKey[];

export const CITATIONS_SEARCHABLE_FIELDS = [
  "code",
  "quotedHash",
] as const satisfies readonly CitationsKey[];

export const CITATIONS_FILTERABLE_FIELDS = [
  "captureId",
  "documentId",
  "evidenceId",
  "fileVersionId",
  "id",
  "locatorKindId",
] as const satisfies readonly CitationsKey[];

export const CITATIONS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "recordedAt",
  "updatedAt",
] as const satisfies readonly CitationsKey[];

export const CITATIONS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<ICitations> = {
  searchableFields: [...CITATIONS_SEARCHABLE_FIELDS],
  filterFields: [...CITATIONS_FILTERABLE_FIELDS],
  dateRangeFields: [...CITATIONS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const CITATIONS_SELECTABLE_FIELDS = [
  "captureId",
  "code",
  "createdAt",
  "deletedAt",
  "documentId",
  "evidenceId",
  "fileVersionId",
  "id",
  "locator",
  "locatorKindId",
  "quotedHash",
  "recordedAt",
  "updatedAt",
  "version",
] as const satisfies readonly CitationsKey[];

export const CITATIONS_DEFAULT_SELECT_FIELDS = [
  "captureId",
  "code",
  "createdAt",
  "deletedAt",
  "documentId",
  "evidenceId",
  "fileVersionId",
  "id",
  "locator",
  "locatorKindId",
  "quotedHash",
  "recordedAt",
  "updatedAt",
  "version",
] as const satisfies readonly CitationsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const CITATIONS_EDITABLE_FIELDS = [
  "captureId",
  "code",
  "documentId",
  "evidenceId",
  "fileVersionId",
  "locator",
  "locatorKindId",
  "quotedHash",
  "recordedAt",
] as const satisfies readonly CitationsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const CITATIONS_AS_ONE_RELATION_CONFIG = {
  relation: "citations",
  type: ERelationType.One,
  selectableFields: CITATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: CITATIONS_DEFAULT_SELECT_FIELDS,
} as const satisfies ICitationsAsOneRelationConfig;

export const CITATIONS_AS_MANY_RELATION_CONFIG = {
  relation: "citations",
  type: ERelationType.Many,
  selectableFields: CITATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: CITATIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: CITATIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies ICitationsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const CITATIONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<CitationsRelationKey>().one(
    () => CapturesConfig.CAPTURES_AS_ONE_RELATION_CONFIG,
    "capture",
  ),
  Q.createRelationKeyMapper<CitationsRelationKey>().one(
    () => DocumentsConfig.DOCUMENTS_AS_ONE_RELATION_CONFIG,
    "document",
  ),
  Q.createRelationKeyMapper<CitationsRelationKey>().one(
    () => EvidenceConfig.EVIDENCE_AS_ONE_RELATION_CONFIG,
    "evidence",
  ),
  Q.createRelationKeyMapper<CitationsRelationKey>().one(
    () => FileVersionsConfig.FILE_VERSIONS_AS_ONE_RELATION_CONFIG,
    "fileVersion",
  ),
  Q.createRelationKeyMapper<CitationsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "locatorKind",
  ),
] as const;

export const CITATIONS_MANY_RELATION_QUERY_OPTIONS = [] as const;

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
  relationKeys: CITATIONS_RELATION_KEYS,
  editableFields: CITATIONS_EDITABLE_FIELDS,
  asOne: CITATIONS_AS_ONE_RELATION_CONFIG,
  asMany: CITATIONS_AS_MANY_RELATION_CONFIG,
  oneRelations: CITATIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: CITATIONS_MANY_RELATION_QUERY_OPTIONS,
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
