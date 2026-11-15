// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as CountryConfig from '#/modules/reference/types/country.config';
import * as ValueConfig from '#/modules/reference/types/value.config';
import * as EntitiesConfig from '#/modules/official/types/entities.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IPublishers,
  PublishersKey,
  PublishersRelationKey,
  PublishersSortableField,
  PublishersFilterableField,
  PublishersDateRangeField,
  PublishersSelectableField,
  IPublishersAsOneRelationConfig,
  IPublishersAsManyRelationConfig
} from './publishers.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PUBLISHERS_RELATION_KEYS = ['country', 'kind', 'officialEntity', ] as const satisfies readonly PublishersKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PUBLISHERS_SORTABLE_FIELDS = [] as const satisfies readonly PublishersKey[];

export const PUBLISHERS_SEARCHABLE_FIELDS = [] as const satisfies readonly PublishersKey[];

export const PUBLISHERS_FILTERABLE_FIELDS = [] as const satisfies readonly PublishersKey[];

export const PUBLISHERS_DATE_RANGE_FIELDS = [] as const satisfies readonly PublishersKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PUBLISHERS_SELECTABLE_FIELDS = ['code', 'countryId', 'createdAt', 'deletedAt', 'id', 'kindId', 'name', 'officialEntityId', 'updatedAt', 'version', ] as const satisfies readonly PublishersKey[];

export const PUBLISHERS_DEFAULT_SELECT_FIELDS = ['code', 'countryId', 'createdAt', 'deletedAt', 'id', 'kindId', 'name', 'officialEntityId', 'updatedAt', 'version', ] as const satisfies readonly PublishersSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PUBLISHERS_EDITABLE_FIELDS = ['code', 'countryId', 'kindId', 'name', 'officialEntityId', ] as const satisfies readonly PublishersKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PUBLISHERS_AS_ONE_RELATION_CONFIG = {
  relation: 'publishers',
  type: ERelationType.One,
  selectableFields: PUBLISHERS_SELECTABLE_FIELDS,
  defaultSelectFields: PUBLISHERS_DEFAULT_SELECT_FIELDS
} as const satisfies IPublishersAsOneRelationConfig;

export const PUBLISHERS_AS_MANY_RELATION_CONFIG = {
  relation: 'publisherss',
  type: ERelationType.Many,
  selectableFields: PUBLISHERS_SELECTABLE_FIELDS,
  defaultSelectFields: PUBLISHERS_DEFAULT_SELECT_FIELDS,
  sortableFields: PUBLISHERS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IPublishersAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PUBLISHERS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<PublishersRelationKey>().one(CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG, 'country'),
  Q.createRelationKeyMapper<PublishersRelationKey>().one(ValueConfig.VALUE_AS_ONE_RELATION_CONFIG, 'kind'),
  Q.createRelationKeyMapper<PublishersRelationKey>().one(EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG, 'officialEntity'),
] as const;

export const PUBLISHERS_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PUBLISHERS_QUERY_OPTIONS = {
  searchableFields: PUBLISHERS_SEARCHABLE_FIELDS,
  selectableFields: PUBLISHERS_SELECTABLE_FIELDS,
  defaultSelectFields: PUBLISHERS_DEFAULT_SELECT_FIELDS,
  sortableFields: PUBLISHERS_SORTABLE_FIELDS,
  filterFields: PUBLISHERS_FILTERABLE_FIELDS,
  dateRangeFields: PUBLISHERS_DATE_RANGE_FIELDS,
  oneRelations: PUBLISHERS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PUBLISHERS_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IPublishers,
  PublishersSortableField,
  PublishersSelectableField,
  PublishersFilterableField,
  PublishersDateRangeField,
  PublishersRelationKey,
  typeof PUBLISHERS_ONE_RELATION_QUERY_OPTIONS,
  typeof PUBLISHERS_MANY_RELATION_QUERY_OPTIONS
>;