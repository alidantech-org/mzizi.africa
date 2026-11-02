// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { VariantKind } from '#/types/filesystem/variant-kind.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as StoredObjectTypes from '#/modules/filesystem/types/stored-object.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  FILE_VARIANT_RELATION_KEYS,
  FILE_VARIANT_SORTABLE_FIELDS,
  FILE_VARIANT_SEARCHABLE_FIELDS,
  FILE_VARIANT_FILTERABLE_FIELDS,
  FILE_VARIANT_DATE_RANGE_FIELDS,
  FILE_VARIANT_SELECTABLE_FIELDS,
  FILE_VARIANT_DEFAULT_SELECT_FIELDS,
  FILE_VARIANT_EDITABLE_FIELDS
} from './file-variant.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** File Variant */
export interface IFileVariant extends B.IBase {
  derivedObjectId: string;
  kind: VariantKind;
  objectId: string;
  parameters: string | null;
  readonly storedObject?: StoredObjectTypes.IStoredObject;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type FileVariantKey = keyof IFileVariant;

export type FileVariantRelationKey = (typeof FILE_VARIANT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IFileVariantReadonlyFields = B.IBaseReadonlyFields;

export type IFileVariantContextualFields = never;

export type IFileVariantSensitiveFields = never;

export type IFileVariantTransitionFields = never;

export type IFileVariantImmutableFields =
  | IFileVariantReadonlyFields
  | IFileVariantContextualFields
  | IFileVariantSensitiveFields
  | IFileVariantTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IFileVariantCreatable = Omit<IFileVariant, IFileVariantImmutableFields | FileVariantRelationKey>;

export type IFileVariantSystemWritable = Omit<IFileVariant, B.IBaseReadonlyFields | FileVariantRelationKey>;

export type IFileVariantUpdatable = Partial<Omit<IFileVariant, IFileVariantImmutableFields | FileVariantRelationKey>>;

export interface IFileVariantTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type FileVariantSortableField = (typeof FILE_VARIANT_SORTABLE_FIELDS)[number];

export type FileVariantSearchableField = (typeof FILE_VARIANT_SEARCHABLE_FIELDS)[number];

export type FileVariantFilterableField = (typeof FILE_VARIANT_FILTERABLE_FIELDS)[number];

export type FileVariantDateRangeField = (typeof FILE_VARIANT_DATE_RANGE_FIELDS)[number];

export type FileVariantSelectableField = (typeof FILE_VARIANT_SELECTABLE_FIELDS)[number];

export type FileVariantDefaultSelectField = (typeof FILE_VARIANT_DEFAULT_SELECT_FIELDS)[number];

export type FileVariantEditableField = (typeof FILE_VARIANT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IFileVariantAsOneRelationConfig = Q.IOneRelationConfig<'fileVariant', FileVariantSelectableField>;

export type IFileVariantAsManyRelationConfig = Q.IManyRelationConfig<'fileVariants', FileVariantSelectableField, FileVariantSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IFileVariantAsOneRelationQuery = Q.IAsOneRelationQuery<IFileVariant, FileVariantSelectableField>;

export type IFileVariantAsManyRelationQuery = Q.IAsManyRelationQuery<IFileVariant, FileVariantSelectableField, FileVariantSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IFileVariantRelationMap extends Record<FileVariantRelationKey, unknown> {
  storedObject: StoredObjectTypes.IStoredObjectAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IFileVariantRelationQueries = Q.IBaseRelationQueries<IFileVariant, FileVariantRelationKey, IFileVariantRelationMap>;

export type IFileVariantItemQuery = Q.IBaseItemQuery<
  IFileVariant,
  FileVariantRelationKey,
  FileVariantSelectableField,
  FileVariantRelationKey,
  FileVariantSelectableField,
  IFileVariantRelationMap,
  IFileVariantRelationQueries
>;

export type IFileVariantListQuery = Q.IBaseListQuery<
  IFileVariant,
  FileVariantRelationKey,
  FileVariantSelectableField,
  FileVariantSortableField,
  FileVariantRelationKey,
  FileVariantSelectableField,
  FileVariantSortableField,
  FileVariantDateRangeField,
  FileVariantFilterableField,
  IFileVariantRelationMap,
  IFileVariantRelationQueries,
  IFileVariantItemQuery
>;