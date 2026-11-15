// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as FileVersionsTypes from "#/modules/filesystem/schema/types/file-versions/file-versions.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  FILE_RELATIONS_RELATION_KEYS,
  FILE_RELATIONS_SORTABLE_FIELDS,
  FILE_RELATIONS_SEARCHABLE_FIELDS,
  FILE_RELATIONS_FILTERABLE_FIELDS,
  FILE_RELATIONS_DATE_RANGE_FIELDS,
  FILE_RELATIONS_SELECTABLE_FIELDS,
  FILE_RELATIONS_DEFAULT_SELECT_FIELDS,
  FILE_RELATIONS_EDITABLE_FIELDS,
} from "./file-relations.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Directed exact input-to-output lineage with a pinned processing description; originals remain immutable. */
export interface IFileRelations extends B.IBase {
  derivedVersionId: string;
  kindId: string;
  processingProvenance: string;
  sourceVersionId: string;
  readonly derivedVersion?: FileVersionsTypes.IFileVersions;
  readonly kind?: ValueTypes.IValue;
  readonly sourceVersion?: FileVersionsTypes.IFileVersions;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type FileRelationsKey = keyof IFileRelations;

export type FileRelationsRelationKey = (typeof FILE_RELATIONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IFileRelationsReadonlyFields = B.IBaseReadonlyFields;

export type IFileRelationsContextualFields = never;

export type IFileRelationsSensitiveFields = never;

export type IFileRelationsTransitionFields = never;

export type IFileRelationsImmutableFields =
  | IFileRelationsReadonlyFields
  | IFileRelationsContextualFields
  | IFileRelationsSensitiveFields
  | IFileRelationsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IFileRelationsCreatable = Omit<
  IFileRelations,
  IFileRelationsImmutableFields | FileRelationsRelationKey
>;

export type IFileRelationsSystemWritable = Omit<
  IFileRelations,
  B.IBaseReadonlyFields | FileRelationsRelationKey
>;

export type IFileRelationsUpdatable = Partial<
  Omit<IFileRelations, IFileRelationsImmutableFields | FileRelationsRelationKey>
>;

export interface IFileRelationsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type FileRelationsSortableField = (typeof FILE_RELATIONS_SORTABLE_FIELDS)[number];

export type FileRelationsSearchableField = (typeof FILE_RELATIONS_SEARCHABLE_FIELDS)[number];

export type FileRelationsFilterableField = (typeof FILE_RELATIONS_FILTERABLE_FIELDS)[number];

export type FileRelationsDateRangeField = (typeof FILE_RELATIONS_DATE_RANGE_FIELDS)[number];

export type FileRelationsSelectableField = (typeof FILE_RELATIONS_SELECTABLE_FIELDS)[number];

export type FileRelationsDefaultSelectField = (typeof FILE_RELATIONS_DEFAULT_SELECT_FIELDS)[number];

export type FileRelationsEditableField = (typeof FILE_RELATIONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IFileRelationsAsOneRelationConfig = Q.IOneRelationConfig<
  "fileRelations",
  FileRelationsSelectableField
>;

export type IFileRelationsAsManyRelationConfig = Q.IManyRelationConfig<
  "fileRelations",
  FileRelationsSelectableField,
  FileRelationsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IFileRelationsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IFileRelations,
  FileRelationsSelectableField
>;

export type IFileRelationsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IFileRelations,
  FileRelationsSelectableField,
  FileRelationsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IFileRelationsRelationMap extends Record<FileRelationsRelationKey, unknown> {
  derivedVersion: FileVersionsTypes.IFileVersionsAsOneRelationQuery;
  kind: ValueTypes.IValueAsOneRelationQuery;
  sourceVersion: FileVersionsTypes.IFileVersionsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IFileRelationsRelationQueries = Q.IBaseRelationQueries<
  IFileRelations,
  FileRelationsRelationKey,
  IFileRelationsRelationMap
>;

export type IFileRelationsItemQuery = Q.IBaseItemQuery<
  IFileRelations,
  FileRelationsRelationKey,
  FileRelationsSelectableField,
  FileRelationsRelationKey,
  FileRelationsSelectableField,
  IFileRelationsRelationMap,
  IFileRelationsRelationQueries
>;

export type IFileRelationsListQuery = Q.IBaseListQuery<
  IFileRelations,
  FileRelationsRelationKey,
  FileRelationsSelectableField,
  FileRelationsSortableField,
  FileRelationsRelationKey,
  FileRelationsSelectableField,
  FileRelationsSortableField,
  FileRelationsDateRangeField,
  FileRelationsFilterableField,
  IFileRelationsRelationMap,
  IFileRelationsRelationQueries,
  IFileRelationsItemQuery
>;
