// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as FileVersionsConfig from "#/modules/filesystem/schema/types/file-versions/file-versions.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as PublishersConfig from "#/modules/source/schema/types/publishers/publishers.config";

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
  IDocumentsAsManyRelationConfig,
} from "./documents.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const DOCUMENTS_RELATION_KEYS = [
  "fileVersion",
  "kind",
  "parent",
  "publisher",
] as const satisfies readonly DocumentsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const DOCUMENTS_SORTABLE_FIELDS = [
  "code",
  "contentType",
  "createdAt",
  "deletedAt",
  "fileVersionId",
  "id",
  "kindId",
  "parentId",
  "publishedOn",
  "publisherId",
  "sha256",
  "sizeBytes",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly DocumentsKey[];

export const DOCUMENTS_SEARCHABLE_FIELDS = [
  "code",
  "contentType",
  "sha256",
  "title",
] as const satisfies readonly DocumentsKey[];

export const DOCUMENTS_FILTERABLE_FIELDS = [
  "fileVersionId",
  "id",
  "kindId",
  "parentId",
  "publisherId",
] as const satisfies readonly DocumentsKey[];

export const DOCUMENTS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "publishedOn",
  "updatedAt",
] as const satisfies readonly DocumentsKey[];

export const DOCUMENTS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IDocuments> = {
  searchableFields: [...DOCUMENTS_SEARCHABLE_FIELDS],
  filterFields: [...DOCUMENTS_FILTERABLE_FIELDS],
  dateRangeFields: [...DOCUMENTS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const DOCUMENTS_SELECTABLE_FIELDS = [
  "code",
  "contentType",
  "createdAt",
  "deletedAt",
  "fileVersionId",
  "id",
  "kindId",
  "parentId",
  "publishedOn",
  "publisherId",
  "sha256",
  "sizeBytes",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly DocumentsKey[];

export const DOCUMENTS_DEFAULT_SELECT_FIELDS = [
  "code",
  "contentType",
  "createdAt",
  "deletedAt",
  "fileVersionId",
  "id",
  "kindId",
  "parentId",
  "publishedOn",
  "publisherId",
  "sha256",
  "sizeBytes",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly DocumentsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const DOCUMENTS_EDITABLE_FIELDS = [
  "code",
  "contentType",
  "fileVersionId",
  "kindId",
  "parentId",
  "publishedOn",
  "publisherId",
  "sha256",
  "sizeBytes",
  "title",
] as const satisfies readonly DocumentsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const DOCUMENTS_AS_ONE_RELATION_CONFIG = {
  relation: "documents",
  type: ERelationType.One,
  selectableFields: DOCUMENTS_SELECTABLE_FIELDS,
  defaultSelectFields: DOCUMENTS_DEFAULT_SELECT_FIELDS,
} as const satisfies IDocumentsAsOneRelationConfig;

export const DOCUMENTS_AS_MANY_RELATION_CONFIG = {
  relation: "documents",
  type: ERelationType.Many,
  selectableFields: DOCUMENTS_SELECTABLE_FIELDS,
  defaultSelectFields: DOCUMENTS_DEFAULT_SELECT_FIELDS,
  sortableFields: DOCUMENTS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IDocumentsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const DOCUMENTS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<DocumentsRelationKey>().one(
    () => FileVersionsConfig.FILE_VERSIONS_AS_ONE_RELATION_CONFIG,
    "fileVersion",
  ),
  Q.createRelationKeyMapper<DocumentsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "kind",
  ),
  Q.createRelationKeyMapper<DocumentsRelationKey>().one(
    () => PublishersConfig.PUBLISHERS_AS_ONE_RELATION_CONFIG,
    "publisher",
  ),
] as const;

export const DOCUMENTS_MANY_RELATION_QUERY_OPTIONS = [] as const;

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
  relationKeys: DOCUMENTS_RELATION_KEYS,
  editableFields: DOCUMENTS_EDITABLE_FIELDS,
  asOne: DOCUMENTS_AS_ONE_RELATION_CONFIG,
  asMany: DOCUMENTS_AS_MANY_RELATION_CONFIG,
  oneRelations: DOCUMENTS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: DOCUMENTS_MANY_RELATION_QUERY_OPTIONS,
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
