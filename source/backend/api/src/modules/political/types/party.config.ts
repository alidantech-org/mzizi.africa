// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IParty,
  PartyKey,
  PartyRelationKey,
  PartySortableField,
  PartyFilterableField,
  PartyDateRangeField,
  PartySelectableField,
  IPartyAsOneRelationConfig,
  IPartyAsManyRelationConfig
} from './party.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PARTY_RELATION_KEYS = [] as const satisfies readonly PartyKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PARTY_SORTABLE_FIELDS = ['code', 'createdAt', 'name', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly PartyKey[];

export const PARTY_SEARCHABLE_FIELDS = ['abbreviation', 'code', 'name', ] as const satisfies readonly PartyKey[];

export const PARTY_FILTERABLE_FIELDS = ['abbreviation', 'code', 'id', 'isCurrent', 'jurisdictionId', 'name', 'registryAuthorityId', 'status', 'version', ] as const satisfies readonly PartyKey[];

export const PARTY_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly PartyKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PARTY_SELECTABLE_FIELDS = ['abbreviation', 'code', 'createdAt', 'id', 'isCurrent', 'jurisdictionId', 'name', 'registryAuthorityId', 'registryIdentifier', 'status', 'symbolUrl', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly PartyKey[];

export const PARTY_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly PartySelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PARTY_EDITABLE_FIELDS = ['abbreviation', 'code', 'isCurrent', 'jurisdictionId', 'name', 'registryAuthorityId', 'registryIdentifier', 'status', 'symbolUrl', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly PartyKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PARTY_AS_ONE_RELATION_CONFIG = {
  relation: 'party',
  type: ERelationType.One,
  selectableFields: PARTY_SELECTABLE_FIELDS,
  defaultSelectFields: PARTY_DEFAULT_SELECT_FIELDS
} as const satisfies IPartyAsOneRelationConfig;

export const PARTY_AS_MANY_RELATION_CONFIG = {
  relation: 'partys',
  type: ERelationType.Many,
  selectableFields: PARTY_SELECTABLE_FIELDS,
  defaultSelectFields: PARTY_DEFAULT_SELECT_FIELDS,
  sortableFields: PARTY_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IPartyAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PARTY_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const PARTY_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PARTY_QUERY_OPTIONS = {
  searchableFields: PARTY_SEARCHABLE_FIELDS,
  selectableFields: PARTY_SELECTABLE_FIELDS,
  defaultSelectFields: PARTY_DEFAULT_SELECT_FIELDS,
  sortableFields: PARTY_SORTABLE_FIELDS,
  filterFields: PARTY_FILTERABLE_FIELDS,
  dateRangeFields: PARTY_DATE_RANGE_FIELDS,
  oneRelations: PARTY_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PARTY_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IParty,
  PartySortableField,
  PartySelectableField,
  PartyFilterableField,
  PartyDateRangeField,
  PartyRelationKey,
  typeof PARTY_ONE_RELATION_QUERY_OPTIONS,
  typeof PARTY_MANY_RELATION_QUERY_OPTIONS
>;