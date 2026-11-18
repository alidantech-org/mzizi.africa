// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as FileVersionsTypes from "#/modules/filesystem/schema/types/file-versions/file-versions.types";
import type * as LanguageTypes from "#/modules/reference/schema/types/language/language.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  CONTENTS_RELATION_KEYS,
  CONTENTS_SORTABLE_FIELDS,
  CONTENTS_SEARCHABLE_FIELDS,
  CONTENTS_FILTERABLE_FIELDS,
  CONTENTS_DATE_RANGE_FIELDS,
  CONTENTS_SELECTABLE_FIELDS,
  CONTENTS_DEFAULT_SELECT_FIELDS,
  CONTENTS_EDITABLE_FIELDS,
} from "./contents.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One authored text (markdown) about a subject record: an institution, a place, a person, the Constitution or general knowledge. Media is referenced, never embedded. */
export interface IContents extends B.IBase {
  body: string;
  categoryId: string;
  classificationId: string | null;
  code: string;
  fileVersionId: string | null;
  isDevelopmentText: boolean;
  languageId: string;
  slug: string;
  subjectId: string;
  subjectTable: SubjectTable;
  summary: string | null;
  title: string;
  readonly category?: ValueTypes.IValue;
  readonly classification?: ValueTypes.IValue;
  readonly fileVersion?: FileVersionsTypes.IFileVersions;
  readonly language?: LanguageTypes.ILanguage;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ContentsKey = keyof IContents;

export type ContentsRelationKey = (typeof CONTENTS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IContentsReadonlyFields = B.IBaseReadonlyFields;

export type IContentsContextualFields = never;

export type IContentsSensitiveFields = never;

export type IContentsTransitionFields = never;

export type IContentsImmutableFields =
  | IContentsReadonlyFields
  | IContentsContextualFields
  | IContentsSensitiveFields
  | IContentsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IContentsCreatable = Omit<IContents, IContentsImmutableFields | ContentsRelationKey>;

export type IContentsSystemWritable = Omit<IContents, B.IBaseReadonlyFields | ContentsRelationKey>;

export type IContentsUpdatable = Partial<
  Omit<IContents, IContentsImmutableFields | ContentsRelationKey>
>;

export interface IContentsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ContentsSortableField = (typeof CONTENTS_SORTABLE_FIELDS)[number];

export type ContentsSearchableField = (typeof CONTENTS_SEARCHABLE_FIELDS)[number];

export type ContentsFilterableField = (typeof CONTENTS_FILTERABLE_FIELDS)[number];

export type ContentsDateRangeField = (typeof CONTENTS_DATE_RANGE_FIELDS)[number];

export type ContentsSelectableField = (typeof CONTENTS_SELECTABLE_FIELDS)[number];

export type ContentsDefaultSelectField = (typeof CONTENTS_DEFAULT_SELECT_FIELDS)[number];

export type ContentsEditableField = (typeof CONTENTS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IContentsAsOneRelationConfig = Q.IOneRelationConfig<
  "contents",
  ContentsSelectableField
>;

export type IContentsAsManyRelationConfig = Q.IManyRelationConfig<
  "contents",
  ContentsSelectableField,
  ContentsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IContentsAsOneRelationQuery = Q.IAsOneRelationQuery<IContents, ContentsSelectableField>;

export type IContentsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IContents,
  ContentsSelectableField,
  ContentsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IContentsRelationMap extends Record<ContentsRelationKey, unknown> {
  category: ValueTypes.IValueAsOneRelationQuery;
  classification: ValueTypes.IValueAsOneRelationQuery;
  fileVersion: FileVersionsTypes.IFileVersionsAsOneRelationQuery;
  language: LanguageTypes.ILanguageAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IContentsRelationQueries = Q.IBaseRelationQueries<
  IContents,
  ContentsRelationKey,
  IContentsRelationMap
>;

export type IContentsItemQuery = Q.IBaseItemQuery<
  IContents,
  ContentsRelationKey,
  ContentsSelectableField,
  ContentsRelationKey,
  ContentsSelectableField,
  IContentsRelationMap,
  IContentsRelationQueries
>;

export type IContentsListQuery = Q.IBaseListQuery<
  IContents,
  ContentsRelationKey,
  ContentsSelectableField,
  ContentsSortableField,
  ContentsRelationKey,
  ContentsSelectableField,
  ContentsSortableField,
  ContentsDateRangeField,
  ContentsFilterableField,
  IContentsRelationMap,
  IContentsRelationQueries,
  IContentsItemQuery
>;
