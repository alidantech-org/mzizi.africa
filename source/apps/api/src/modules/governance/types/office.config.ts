// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as InstitutionConfig from '#/modules/governance/types/institution.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IOffice,
  OfficeKey,
  OfficeRelationKey,
  OfficeSortableField,
  OfficeFilterableField,
  OfficeDateRangeField,
  OfficeSelectableField,
  IOfficeAsOneRelationConfig,
  IOfficeAsManyRelationConfig
} from './office.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const OFFICE_RELATION_KEYS = ['institution', ] as const satisfies readonly OfficeKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const OFFICE_SORTABLE_FIELDS = ['code', 'createdAt', 'name', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly OfficeKey[];

export const OFFICE_SEARCHABLE_FIELDS = ['code', 'name', ] as const satisfies readonly OfficeKey[];

export const OFFICE_FILTERABLE_FIELDS = ['code', 'definitionCode', 'id', 'institutionId', 'isCurrent', 'isSingleton', 'name', 'parentOfficeId', 'scopeGeoUnitId', 'version', ] as const satisfies readonly OfficeKey[];

export const OFFICE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly OfficeKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const OFFICE_SELECTABLE_FIELDS = ['code', 'createdAt', 'definitionCode', 'description', 'id', 'institutionId', 'isCurrent', 'isSingleton', 'name', 'parentOfficeId', 'scopeGeoUnitId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly OfficeKey[];

export const OFFICE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly OfficeSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const OFFICE_EDITABLE_FIELDS = ['code', 'definitionCode', 'description', 'institutionId', 'isCurrent', 'isSingleton', 'name', 'parentOfficeId', 'scopeGeoUnitId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly OfficeKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const OFFICE_AS_ONE_RELATION_CONFIG = {
  relation: 'office',
  type: ERelationType.One,
  selectableFields: OFFICE_SELECTABLE_FIELDS,
  defaultSelectFields: OFFICE_DEFAULT_SELECT_FIELDS
} as const satisfies IOfficeAsOneRelationConfig;

export const OFFICE_AS_MANY_RELATION_CONFIG = {
  relation: 'offices',
  type: ERelationType.Many,
  selectableFields: OFFICE_SELECTABLE_FIELDS,
  defaultSelectFields: OFFICE_DEFAULT_SELECT_FIELDS,
  sortableFields: OFFICE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IOfficeAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const OFFICE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<OfficeRelationKey>().one(InstitutionConfig.INSTITUTION_AS_ONE_RELATION_CONFIG, 'institution'),
] as const;

export const OFFICE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const OFFICE_QUERY_OPTIONS = {
  searchableFields: OFFICE_SEARCHABLE_FIELDS,
  selectableFields: OFFICE_SELECTABLE_FIELDS,
  defaultSelectFields: OFFICE_DEFAULT_SELECT_FIELDS,
  sortableFields: OFFICE_SORTABLE_FIELDS,
  filterFields: OFFICE_FILTERABLE_FIELDS,
  dateRangeFields: OFFICE_DATE_RANGE_FIELDS,
  oneRelations: OFFICE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: OFFICE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IOffice,
  OfficeSortableField,
  OfficeSelectableField,
  OfficeFilterableField,
  OfficeDateRangeField,
  OfficeRelationKey,
  typeof OFFICE_ONE_RELATION_QUERY_OPTIONS,
  typeof OFFICE_MANY_RELATION_QUERY_OPTIONS
>;