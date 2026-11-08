// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as StoredObjectConfig from '#/modules/filesystem/types/stored-object.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IFileVariant,
  FileVariantKey,
  FileVariantRelationKey,
  FileVariantSortableField,
  FileVariantFilterableField,
  FileVariantDateRangeField,
  FileVariantSelectableField,
  IFileVariantAsOneRelationConfig,
  IFileVariantAsManyRelationConfig
} from './file-variant.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const FILE_VARIANT_RELATION_KEYS = ['storedObject', ] as const satisfies readonly FileVariantKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const FILE_VARIANT_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', ] as const satisfies readonly FileVariantKey[];

export const FILE_VARIANT_SEARCHABLE_FIELDS = [] as const satisfies readonly FileVariantKey[];

export const FILE_VARIANT_FILTERABLE_FIELDS = ['derivedObjectId', 'id', 'kind', 'objectId', 'version', ] as const satisfies readonly FileVariantKey[];

export const FILE_VARIANT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly FileVariantKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const FILE_VARIANT_SELECTABLE_FIELDS = ['createdAt', 'derivedObjectId', 'id', 'kind', 'objectId', 'parameters', 'updatedAt', ] as const satisfies readonly FileVariantKey[];

export const FILE_VARIANT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly FileVariantSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const FILE_VARIANT_EDITABLE_FIELDS = ['derivedObjectId', 'kind', 'objectId', 'parameters', ] as const satisfies readonly FileVariantKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const FILE_VARIANT_AS_ONE_RELATION_CONFIG = {
  relation: 'fileVariant',
  type: ERelationType.One,
  selectableFields: FILE_VARIANT_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_VARIANT_DEFAULT_SELECT_FIELDS
} as const satisfies IFileVariantAsOneRelationConfig;

export const FILE_VARIANT_AS_MANY_RELATION_CONFIG = {
  relation: 'fileVariants',
  type: ERelationType.Many,
  selectableFields: FILE_VARIANT_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_VARIANT_DEFAULT_SELECT_FIELDS,
  sortableFields: FILE_VARIANT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IFileVariantAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const FILE_VARIANT_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<FileVariantRelationKey>().one(StoredObjectConfig.STORED_OBJECT_AS_ONE_RELATION_CONFIG, 'storedObject'),
] as const;

export const FILE_VARIANT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const FILE_VARIANT_QUERY_OPTIONS = {
  searchableFields: FILE_VARIANT_SEARCHABLE_FIELDS,
  selectableFields: FILE_VARIANT_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_VARIANT_DEFAULT_SELECT_FIELDS,
  sortableFields: FILE_VARIANT_SORTABLE_FIELDS,
  filterFields: FILE_VARIANT_FILTERABLE_FIELDS,
  dateRangeFields: FILE_VARIANT_DATE_RANGE_FIELDS,
  oneRelations: FILE_VARIANT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: FILE_VARIANT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IFileVariant,
  FileVariantSortableField,
  FileVariantSelectableField,
  FileVariantFilterableField,
  FileVariantDateRangeField,
  FileVariantRelationKey,
  typeof FILE_VARIANT_ONE_RELATION_QUERY_OPTIONS,
  typeof FILE_VARIANT_MANY_RELATION_QUERY_OPTIONS
>;