// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as PartyPositionConfig from '#/modules/political/types/party-position.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IPartyPositionHolder,
  PartyPositionHolderKey,
  PartyPositionHolderRelationKey,
  PartyPositionHolderSortableField,
  PartyPositionHolderFilterableField,
  PartyPositionHolderDateRangeField,
  PartyPositionHolderSelectableField,
  IPartyPositionHolderAsOneRelationConfig,
  IPartyPositionHolderAsManyRelationConfig
} from './party-position-holder.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PARTY_POSITION_HOLDER_RELATION_KEYS = ['partyPosition', ] as const satisfies readonly PartyPositionHolderKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PARTY_POSITION_HOLDER_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly PartyPositionHolderKey[];

export const PARTY_POSITION_HOLDER_SEARCHABLE_FIELDS = [] as const satisfies readonly PartyPositionHolderKey[];

export const PARTY_POSITION_HOLDER_FILTERABLE_FIELDS = ['id', 'isActing', 'isCurrent', 'personId', 'positionId', 'version', ] as const satisfies readonly PartyPositionHolderKey[];

export const PARTY_POSITION_HOLDER_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly PartyPositionHolderKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PARTY_POSITION_HOLDER_SELECTABLE_FIELDS = ['createdAt', 'id', 'isActing', 'isCurrent', 'personId', 'positionId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly PartyPositionHolderKey[];

export const PARTY_POSITION_HOLDER_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly PartyPositionHolderSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PARTY_POSITION_HOLDER_EDITABLE_FIELDS = ['isActing', 'isCurrent', 'personId', 'positionId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly PartyPositionHolderKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PARTY_POSITION_HOLDER_AS_ONE_RELATION_CONFIG = {
  relation: 'partyPositionHolder',
  type: ERelationType.One,
  selectableFields: PARTY_POSITION_HOLDER_SELECTABLE_FIELDS,
  defaultSelectFields: PARTY_POSITION_HOLDER_DEFAULT_SELECT_FIELDS
} as const satisfies IPartyPositionHolderAsOneRelationConfig;

export const PARTY_POSITION_HOLDER_AS_MANY_RELATION_CONFIG = {
  relation: 'partyPositionHolders',
  type: ERelationType.Many,
  selectableFields: PARTY_POSITION_HOLDER_SELECTABLE_FIELDS,
  defaultSelectFields: PARTY_POSITION_HOLDER_DEFAULT_SELECT_FIELDS,
  sortableFields: PARTY_POSITION_HOLDER_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IPartyPositionHolderAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PARTY_POSITION_HOLDER_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<PartyPositionHolderRelationKey>().one(PartyPositionConfig.PARTY_POSITION_AS_ONE_RELATION_CONFIG, 'partyPosition'),
] as const;

export const PARTY_POSITION_HOLDER_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PARTY_POSITION_HOLDER_QUERY_OPTIONS = {
  searchableFields: PARTY_POSITION_HOLDER_SEARCHABLE_FIELDS,
  selectableFields: PARTY_POSITION_HOLDER_SELECTABLE_FIELDS,
  defaultSelectFields: PARTY_POSITION_HOLDER_DEFAULT_SELECT_FIELDS,
  sortableFields: PARTY_POSITION_HOLDER_SORTABLE_FIELDS,
  filterFields: PARTY_POSITION_HOLDER_FILTERABLE_FIELDS,
  dateRangeFields: PARTY_POSITION_HOLDER_DATE_RANGE_FIELDS,
  oneRelations: PARTY_POSITION_HOLDER_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PARTY_POSITION_HOLDER_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IPartyPositionHolder,
  PartyPositionHolderSortableField,
  PartyPositionHolderSelectableField,
  PartyPositionHolderFilterableField,
  PartyPositionHolderDateRangeField,
  PartyPositionHolderRelationKey,
  typeof PARTY_POSITION_HOLDER_ONE_RELATION_QUERY_OPTIONS,
  typeof PARTY_POSITION_HOLDER_MANY_RELATION_QUERY_OPTIONS
>;