// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import { ERelationType } from '#/modules/common/schema/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as EntitiesConfig from '#/modules/official/schema/types/entities/entities.config';
import * as ValueConfig from '#/modules/reference/schema/types/value/value.config';
import * as IndividualsConfig from '#/modules/official/schema/types/individuals/individuals.config';
import * as OfficesConfig from '#/modules/governance/schema/types/offices/offices.config';
import * as CitationsConfig from '#/modules/source/schema/types/citations/citations.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IHolders,
  HoldersKey,
  HoldersRelationKey,
  HoldersSortableField,
  HoldersFilterableField,
  HoldersDateRangeField,
  HoldersSelectableField,
  IHoldersAsOneRelationConfig,
  IHoldersAsManyRelationConfig
} from './holders.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const HOLDERS_RELATION_KEYS = ['appointedByEntity', 'appointmentKind', 'individual', 'office', 'sourceCitation', ] as const satisfies readonly HoldersKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const HOLDERS_SORTABLE_FIELDS = [] as const satisfies readonly HoldersKey[];

export const HOLDERS_SEARCHABLE_FIELDS = [] as const satisfies readonly HoldersKey[];

export const HOLDERS_FILTERABLE_FIELDS = [] as const satisfies readonly HoldersKey[];

export const HOLDERS_DATE_RANGE_FIELDS = [] as const satisfies readonly HoldersKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const HOLDERS_SELECTABLE_FIELDS = ['appointedByEntityId', 'appointmentKindId', 'createdAt', 'deletedAt', 'id', 'individualId', 'officeId', 'sourceCitationId', 'updatedAt', 'validFrom', 'validUntil', 'version', ] as const satisfies readonly HoldersKey[];

export const HOLDERS_DEFAULT_SELECT_FIELDS = ['appointedByEntityId', 'appointmentKindId', 'createdAt', 'deletedAt', 'id', 'individualId', 'officeId', 'sourceCitationId', 'updatedAt', 'validFrom', 'validUntil', 'version', ] as const satisfies readonly HoldersSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const HOLDERS_EDITABLE_FIELDS = ['appointedByEntityId', 'appointmentKindId', 'individualId', 'officeId', 'sourceCitationId', 'validFrom', 'validUntil', ] as const satisfies readonly HoldersKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const HOLDERS_AS_ONE_RELATION_CONFIG = {
  relation: 'holders',
  type: ERelationType.One,
  selectableFields: HOLDERS_SELECTABLE_FIELDS,
  defaultSelectFields: HOLDERS_DEFAULT_SELECT_FIELDS
} as const satisfies IHoldersAsOneRelationConfig;

export const HOLDERS_AS_MANY_RELATION_CONFIG = {
  relation: 'holderss',
  type: ERelationType.Many,
  selectableFields: HOLDERS_SELECTABLE_FIELDS,
  defaultSelectFields: HOLDERS_DEFAULT_SELECT_FIELDS,
  sortableFields: HOLDERS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IHoldersAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const HOLDERS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<HoldersRelationKey>().one(EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG, 'appointedByEntity'),
  Q.createRelationKeyMapper<HoldersRelationKey>().one(ValueConfig.VALUE_AS_ONE_RELATION_CONFIG, 'appointmentKind'),
  Q.createRelationKeyMapper<HoldersRelationKey>().one(IndividualsConfig.INDIVIDUALS_AS_ONE_RELATION_CONFIG, 'individual'),
  Q.createRelationKeyMapper<HoldersRelationKey>().one(OfficesConfig.OFFICES_AS_ONE_RELATION_CONFIG, 'office'),
  Q.createRelationKeyMapper<HoldersRelationKey>().one(CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG, 'sourceCitation'),
] as const;

export const HOLDERS_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const HOLDERS_QUERY_OPTIONS = {
  searchableFields: HOLDERS_SEARCHABLE_FIELDS,
  selectableFields: HOLDERS_SELECTABLE_FIELDS,
  defaultSelectFields: HOLDERS_DEFAULT_SELECT_FIELDS,
  sortableFields: HOLDERS_SORTABLE_FIELDS,
  filterFields: HOLDERS_FILTERABLE_FIELDS,
  dateRangeFields: HOLDERS_DATE_RANGE_FIELDS,
  oneRelations: HOLDERS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: HOLDERS_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IHolders,
  HoldersSortableField,
  HoldersSelectableField,
  HoldersFilterableField,
  HoldersDateRangeField,
  HoldersRelationKey,
  typeof HOLDERS_ONE_RELATION_QUERY_OPTIONS,
  typeof HOLDERS_MANY_RELATION_QUERY_OPTIONS
>;