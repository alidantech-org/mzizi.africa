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
  IPartyIdeology,
  PartyIdeologyKey,
  PartyIdeologyRelationKey,
  PartyIdeologySortableField,
  PartyIdeologyFilterableField,
  PartyIdeologyDateRangeField,
  PartyIdeologySelectableField,
  IPartyIdeologyAsOneRelationConfig,
  IPartyIdeologyAsManyRelationConfig
} from './party-ideology.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PARTY_IDEOLOGY_RELATION_KEYS = ['party', ] as const satisfies readonly PartyIdeologyKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PARTY_IDEOLOGY_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly PartyIdeologyKey[];

export const PARTY_IDEOLOGY_SEARCHABLE_FIELDS = [] as const satisfies readonly PartyIdeologyKey[];

export const PARTY_IDEOLOGY_FILTERABLE_FIELDS = ['id', 'ideologyId', 'isCurrent', 'partyId', 'version', ] as const satisfies readonly PartyIdeologyKey[];

export const PARTY_IDEOLOGY_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly PartyIdeologyKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PARTY_IDEOLOGY_SELECTABLE_FIELDS = ['createdAt', 'id', 'ideologyId', 'isCurrent', 'partyId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly PartyIdeologyKey[];

export const PARTY_IDEOLOGY_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly PartyIdeologySelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PARTY_IDEOLOGY_EDITABLE_FIELDS = ['ideologyId', 'isCurrent', 'partyId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly PartyIdeologyKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PARTY_IDEOLOGY_AS_ONE_RELATION_CONFIG = {
  relation: 'partyIdeology',
  type: ERelationType.One,
  selectableFields: PARTY_IDEOLOGY_SELECTABLE_FIELDS,
  defaultSelectFields: PARTY_IDEOLOGY_DEFAULT_SELECT_FIELDS
} as const satisfies IPartyIdeologyAsOneRelationConfig;

export const PARTY_IDEOLOGY_AS_MANY_RELATION_CONFIG = {
  relation: 'partyIdeologys',
  type: ERelationType.Many,
  selectableFields: PARTY_IDEOLOGY_SELECTABLE_FIELDS,
  defaultSelectFields: PARTY_IDEOLOGY_DEFAULT_SELECT_FIELDS,
  sortableFields: PARTY_IDEOLOGY_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IPartyIdeologyAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PARTY_IDEOLOGY_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<PartyIdeologyRelationKey>().one(PartyConfig.PARTY_AS_ONE_RELATION_CONFIG, 'party'),
] as const;

export const PARTY_IDEOLOGY_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PARTY_IDEOLOGY_QUERY_OPTIONS = {
  searchableFields: PARTY_IDEOLOGY_SEARCHABLE_FIELDS,
  selectableFields: PARTY_IDEOLOGY_SELECTABLE_FIELDS,
  defaultSelectFields: PARTY_IDEOLOGY_DEFAULT_SELECT_FIELDS,
  sortableFields: PARTY_IDEOLOGY_SORTABLE_FIELDS,
  filterFields: PARTY_IDEOLOGY_FILTERABLE_FIELDS,
  dateRangeFields: PARTY_IDEOLOGY_DATE_RANGE_FIELDS,
  oneRelations: PARTY_IDEOLOGY_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PARTY_IDEOLOGY_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IPartyIdeology,
  PartyIdeologySortableField,
  PartyIdeologySelectableField,
  PartyIdeologyFilterableField,
  PartyIdeologyDateRangeField,
  PartyIdeologyRelationKey,
  typeof PARTY_IDEOLOGY_ONE_RELATION_QUERY_OPTIONS,
  typeof PARTY_IDEOLOGY_MANY_RELATION_QUERY_OPTIONS
>;