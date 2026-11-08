// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as PartyConfig from '#/modules/political/types/party.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IPartyUnit,
  PartyUnitKey,
  PartyUnitRelationKey,
  PartyUnitSortableField,
  PartyUnitFilterableField,
  PartyUnitDateRangeField,
  PartyUnitSelectableField,
  IPartyUnitAsOneRelationConfig,
  IPartyUnitAsManyRelationConfig
} from './party-unit.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PARTY_UNIT_RELATION_KEYS = ['party', ] as const satisfies readonly PartyUnitKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PARTY_UNIT_SORTABLE_FIELDS = ['code', 'createdAt', 'name', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly PartyUnitKey[];

export const PARTY_UNIT_SEARCHABLE_FIELDS = ['code', 'name', ] as const satisfies readonly PartyUnitKey[];

export const PARTY_UNIT_FILTERABLE_FIELDS = ['code', 'geoUnitId', 'id', 'isCurrent', 'levelId', 'name', 'parentUnitId', 'partyId', 'version', ] as const satisfies readonly PartyUnitKey[];

export const PARTY_UNIT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly PartyUnitKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PARTY_UNIT_SELECTABLE_FIELDS = ['code', 'createdAt', 'geoUnitId', 'id', 'isCurrent', 'levelId', 'name', 'parentUnitId', 'partyId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly PartyUnitKey[];

export const PARTY_UNIT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly PartyUnitSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PARTY_UNIT_EDITABLE_FIELDS = ['code', 'geoUnitId', 'isCurrent', 'levelId', 'name', 'parentUnitId', 'partyId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly PartyUnitKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PARTY_UNIT_AS_ONE_RELATION_CONFIG = {
  relation: 'partyUnit',
  type: ERelationType.One,
  selectableFields: PARTY_UNIT_SELECTABLE_FIELDS,
  defaultSelectFields: PARTY_UNIT_DEFAULT_SELECT_FIELDS
} as const satisfies IPartyUnitAsOneRelationConfig;

export const PARTY_UNIT_AS_MANY_RELATION_CONFIG = {
  relation: 'partyUnits',
  type: ERelationType.Many,
  selectableFields: PARTY_UNIT_SELECTABLE_FIELDS,
  defaultSelectFields: PARTY_UNIT_DEFAULT_SELECT_FIELDS,
  sortableFields: PARTY_UNIT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IPartyUnitAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PARTY_UNIT_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<PartyUnitRelationKey>().one(PartyConfig.PARTY_AS_ONE_RELATION_CONFIG, 'party'),
] as const;

export const PARTY_UNIT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PARTY_UNIT_QUERY_OPTIONS = {
  searchableFields: PARTY_UNIT_SEARCHABLE_FIELDS,
  selectableFields: PARTY_UNIT_SELECTABLE_FIELDS,
  defaultSelectFields: PARTY_UNIT_DEFAULT_SELECT_FIELDS,
  sortableFields: PARTY_UNIT_SORTABLE_FIELDS,
  filterFields: PARTY_UNIT_FILTERABLE_FIELDS,
  dateRangeFields: PARTY_UNIT_DATE_RANGE_FIELDS,
  oneRelations: PARTY_UNIT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PARTY_UNIT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IPartyUnit,
  PartyUnitSortableField,
  PartyUnitSelectableField,
  PartyUnitFilterableField,
  PartyUnitDateRangeField,
  PartyUnitRelationKey,
  typeof PARTY_UNIT_ONE_RELATION_QUERY_OPTIONS,
  typeof PARTY_UNIT_MANY_RELATION_QUERY_OPTIONS
>;