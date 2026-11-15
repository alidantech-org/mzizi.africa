// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as FileVersionsConfig from '#/modules/filesystem/types/file-versions/file-versions.config';
import * as ValueConfig from '#/modules/reference/types/value/value.config';
import * as PublishersConfig from '#/modules/source/types/publishers/publishers.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IAttributions,
  AttributionsKey,
  AttributionsRelationKey,
  AttributionsSortableField,
  AttributionsFilterableField,
  AttributionsDateRangeField,
  AttributionsSelectableField,
  IAttributionsAsOneRelationConfig,
  IAttributionsAsManyRelationConfig
} from './attributions.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const ATTRIBUTIONS_RELATION_KEYS = ['fileVersion', 'licenseValue', 'publisher', ] as const satisfies readonly AttributionsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const ATTRIBUTIONS_SORTABLE_FIELDS = [] as const satisfies readonly AttributionsKey[];

export const ATTRIBUTIONS_SEARCHABLE_FIELDS = [] as const satisfies readonly AttributionsKey[];

export const ATTRIBUTIONS_FILTERABLE_FIELDS = [] as const satisfies readonly AttributionsKey[];

export const ATTRIBUTIONS_DATE_RANGE_FIELDS = [] as const satisfies readonly AttributionsKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const ATTRIBUTIONS_SELECTABLE_FIELDS = ['assessedAt', 'assessorSnapshot', 'createdAt', 'credit', 'deletedAt', 'fileVersionId', 'id', 'licenseValueId', 'publisherId', 'rightsStatement', 'updatedAt', 'version', ] as const satisfies readonly AttributionsKey[];

export const ATTRIBUTIONS_DEFAULT_SELECT_FIELDS = ['assessedAt', 'assessorSnapshot', 'createdAt', 'credit', 'deletedAt', 'fileVersionId', 'id', 'licenseValueId', 'publisherId', 'rightsStatement', 'updatedAt', 'version', ] as const satisfies readonly AttributionsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const ATTRIBUTIONS_EDITABLE_FIELDS = ['assessedAt', 'assessorSnapshot', 'credit', 'fileVersionId', 'licenseValueId', 'publisherId', 'rightsStatement', ] as const satisfies readonly AttributionsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const ATTRIBUTIONS_AS_ONE_RELATION_CONFIG = {
  relation: 'attributions',
  type: ERelationType.One,
  selectableFields: ATTRIBUTIONS_SELECTABLE_FIELDS,
  defaultSelectFields: ATTRIBUTIONS_DEFAULT_SELECT_FIELDS
} as const satisfies IAttributionsAsOneRelationConfig;

export const ATTRIBUTIONS_AS_MANY_RELATION_CONFIG = {
  relation: 'attributionss',
  type: ERelationType.Many,
  selectableFields: ATTRIBUTIONS_SELECTABLE_FIELDS,
  defaultSelectFields: ATTRIBUTIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: ATTRIBUTIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IAttributionsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const ATTRIBUTIONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<AttributionsRelationKey>().one(FileVersionsConfig.FILE_VERSIONS_AS_ONE_RELATION_CONFIG, 'fileVersion'),
  Q.createRelationKeyMapper<AttributionsRelationKey>().one(ValueConfig.VALUE_AS_ONE_RELATION_CONFIG, 'licenseValue'),
  Q.createRelationKeyMapper<AttributionsRelationKey>().one(PublishersConfig.PUBLISHERS_AS_ONE_RELATION_CONFIG, 'publisher'),
] as const;

export const ATTRIBUTIONS_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const ATTRIBUTIONS_QUERY_OPTIONS = {
  searchableFields: ATTRIBUTIONS_SEARCHABLE_FIELDS,
  selectableFields: ATTRIBUTIONS_SELECTABLE_FIELDS,
  defaultSelectFields: ATTRIBUTIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: ATTRIBUTIONS_SORTABLE_FIELDS,
  filterFields: ATTRIBUTIONS_FILTERABLE_FIELDS,
  dateRangeFields: ATTRIBUTIONS_DATE_RANGE_FIELDS,
  oneRelations: ATTRIBUTIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: ATTRIBUTIONS_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IAttributions,
  AttributionsSortableField,
  AttributionsSelectableField,
  AttributionsFilterableField,
  AttributionsDateRangeField,
  AttributionsRelationKey,
  typeof ATTRIBUTIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof ATTRIBUTIONS_MANY_RELATION_QUERY_OPTIONS
>;