// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as PartyUnitConfig from '#/modules/political/types/party-unit.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IPartyPosition,
  PartyPositionKey,
  PartyPositionRelationKey,
  PartyPositionSortableField,
  PartyPositionFilterableField,
  PartyPositionDateRangeField,
  PartyPositionSelectableField,
  IPartyPositionAsOneRelationConfig,
  IPartyPositionAsManyRelationConfig
} from './party-position.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PARTY_POSITION_RELATION_KEYS = ['partyUnit', ] as const satisfies readonly PartyPositionKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PARTY_POSITION_SORTABLE_FIELDS = ['code', 'createdAt', 'title', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly PartyPositionKey[];

export const PARTY_POSITION_SEARCHABLE_FIELDS = ['code', 'title', ] as const satisfies readonly PartyPositionKey[];

export const PARTY_POSITION_FILTERABLE_FIELDS = ['code', 'id', 'isCurrent', 'title', 'unitId', 'version', ] as const satisfies readonly PartyPositionKey[];

export const PARTY_POSITION_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly PartyPositionKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PARTY_POSITION_SELECTABLE_FIELDS = ['code', 'createdAt', 'id', 'isCurrent', 'title', 'unitId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly PartyPositionKey[];

export const PARTY_POSITION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly PartyPositionSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PARTY_POSITION_EDITABLE_FIELDS = ['code', 'isCurrent', 'title', 'unitId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly PartyPositionKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PARTY_POSITION_AS_ONE_RELATION_CONFIG = {
  relation: 'partyPosition',
  type: ERelationType.One,
  selectableFields: PARTY_POSITION_SELECTABLE_FIELDS,
  defaultSelectFields: PARTY_POSITION_DEFAULT_SELECT_FIELDS
} as const satisfies IPartyPositionAsOneRelationConfig;

export const PARTY_POSITION_AS_MANY_RELATION_CONFIG = {
  relation: 'partyPositions',
  type: ERelationType.Many,
  selectableFields: PARTY_POSITION_SELECTABLE_FIELDS,
  defaultSelectFields: PARTY_POSITION_DEFAULT_SELECT_FIELDS,
  sortableFields: PARTY_POSITION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IPartyPositionAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PARTY_POSITION_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<PartyPositionRelationKey>().one(PartyUnitConfig.PARTY_UNIT_AS_ONE_RELATION_CONFIG, 'partyUnit'),
] as const;

export const PARTY_POSITION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PARTY_POSITION_QUERY_OPTIONS = {
  searchableFields: PARTY_POSITION_SEARCHABLE_FIELDS,
  selectableFields: PARTY_POSITION_SELECTABLE_FIELDS,
  defaultSelectFields: PARTY_POSITION_DEFAULT_SELECT_FIELDS,
  sortableFields: PARTY_POSITION_SORTABLE_FIELDS,
  filterFields: PARTY_POSITION_FILTERABLE_FIELDS,
  dateRangeFields: PARTY_POSITION_DATE_RANGE_FIELDS,
  oneRelations: PARTY_POSITION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PARTY_POSITION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IPartyPosition,
  PartyPositionSortableField,
  PartyPositionSelectableField,
  PartyPositionFilterableField,
  PartyPositionDateRangeField,
  PartyPositionRelationKey,
  typeof PARTY_POSITION_ONE_RELATION_QUERY_OPTIONS,
  typeof PARTY_POSITION_MANY_RELATION_QUERY_OPTIONS
>;