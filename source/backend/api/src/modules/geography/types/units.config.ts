// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as CountryConfig from '#/modules/reference/types/country.config';
import * as FeaturesConfig from '#/modules/geography/types/features.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IUnits,
  UnitsKey,
  UnitsRelationKey,
  UnitsSortableField,
  UnitsFilterableField,
  UnitsDateRangeField,
  UnitsSelectableField,
  IUnitsAsOneRelationConfig,
  IUnitsAsManyRelationConfig
} from './units.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const UNITS_RELATION_KEYS = ['country', 'feature', ] as const satisfies readonly UnitsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const UNITS_SORTABLE_FIELDS = [] as const satisfies readonly UnitsKey[];

export const UNITS_SEARCHABLE_FIELDS = [] as const satisfies readonly UnitsKey[];

export const UNITS_FILTERABLE_FIELDS = [] as const satisfies readonly UnitsKey[];

export const UNITS_DATE_RANGE_FIELDS = [] as const satisfies readonly UnitsKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const UNITS_SELECTABLE_FIELDS = ['countryId', 'featureId', 'validFrom', 'validUntil', ] as const satisfies readonly UnitsKey[];

export const UNITS_DEFAULT_SELECT_FIELDS = ['countryId', 'featureId', 'validFrom', 'validUntil', ] as const satisfies readonly UnitsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const UNITS_EDITABLE_FIELDS = ['countryId', 'featureId', 'validFrom', 'validUntil', ] as const satisfies readonly UnitsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const UNITS_AS_ONE_RELATION_CONFIG = {
  relation: 'units',
  type: ERelationType.One,
  selectableFields: UNITS_SELECTABLE_FIELDS,
  defaultSelectFields: UNITS_DEFAULT_SELECT_FIELDS
} as const satisfies IUnitsAsOneRelationConfig;

export const UNITS_AS_MANY_RELATION_CONFIG = {
  relation: 'unitss',
  type: ERelationType.Many,
  selectableFields: UNITS_SELECTABLE_FIELDS,
  defaultSelectFields: UNITS_DEFAULT_SELECT_FIELDS,
  sortableFields: UNITS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IUnitsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const UNITS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<UnitsRelationKey>().one(CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG, 'country'),
  Q.createRelationKeyMapper<UnitsRelationKey>().one(FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG, 'feature'),
] as const;

export const UNITS_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const UNITS_QUERY_OPTIONS = {
  searchableFields: UNITS_SEARCHABLE_FIELDS,
  selectableFields: UNITS_SELECTABLE_FIELDS,
  defaultSelectFields: UNITS_DEFAULT_SELECT_FIELDS,
  sortableFields: UNITS_SORTABLE_FIELDS,
  filterFields: UNITS_FILTERABLE_FIELDS,
  dateRangeFields: UNITS_DATE_RANGE_FIELDS,
  oneRelations: UNITS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: UNITS_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IUnits,
  UnitsSortableField,
  UnitsSelectableField,
  UnitsFilterableField,
  UnitsDateRangeField,
  UnitsRelationKey,
  typeof UNITS_ONE_RELATION_QUERY_OPTIONS,
  typeof UNITS_MANY_RELATION_QUERY_OPTIONS
>;