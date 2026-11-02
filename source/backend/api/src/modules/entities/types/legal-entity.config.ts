// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as JurisdictionConfig from '#/modules/reference/types/jurisdiction.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ILegalEntity,
  LegalEntityKey,
  LegalEntityRelationKey,
  LegalEntitySortableField,
  LegalEntityFilterableField,
  LegalEntityDateRangeField,
  LegalEntitySelectableField,
  ILegalEntityAsOneRelationConfig,
  ILegalEntityAsManyRelationConfig
} from './legal-entity.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const LEGAL_ENTITY_RELATION_KEYS = ['jurisdiction', ] as const satisfies readonly LegalEntityKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const LEGAL_ENTITY_SORTABLE_FIELDS = ['code', 'createdAt', 'officialName', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly LegalEntityKey[];

export const LEGAL_ENTITY_SEARCHABLE_FIELDS = ['code', 'officialName', ] as const satisfies readonly LegalEntityKey[];

export const LEGAL_ENTITY_FILTERABLE_FIELDS = ['code', 'entityTypeId', 'id', 'isCurrent', 'jurisdictionId', 'method', 'officialName', 'parentEntityId', 'status', 'verificationState', 'version', ] as const satisfies readonly LegalEntityKey[];

export const LEGAL_ENTITY_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly LegalEntityKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const LEGAL_ENTITY_SELECTABLE_FIELDS = ['artifactChecksum', 'artifactId', 'code', 'confidence', 'createdAt', 'entityTypeId', 'id', 'isCurrent', 'jurisdictionId', 'licence', 'method', 'officialName', 'parentEntityId', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'status', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly LegalEntityKey[];

export const LEGAL_ENTITY_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly LegalEntitySelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const LEGAL_ENTITY_EDITABLE_FIELDS = ['artifactChecksum', 'artifactId', 'code', 'confidence', 'entityTypeId', 'isCurrent', 'jurisdictionId', 'licence', 'method', 'officialName', 'parentEntityId', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'status', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly LegalEntityKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const LEGAL_ENTITY_AS_ONE_RELATION_CONFIG = {
  relation: 'legalEntity',
  type: ERelationType.One,
  selectableFields: LEGAL_ENTITY_SELECTABLE_FIELDS,
  defaultSelectFields: LEGAL_ENTITY_DEFAULT_SELECT_FIELDS
} as const satisfies ILegalEntityAsOneRelationConfig;

export const LEGAL_ENTITY_AS_MANY_RELATION_CONFIG = {
  relation: 'legalEntitys',
  type: ERelationType.Many,
  selectableFields: LEGAL_ENTITY_SELECTABLE_FIELDS,
  defaultSelectFields: LEGAL_ENTITY_DEFAULT_SELECT_FIELDS,
  sortableFields: LEGAL_ENTITY_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ILegalEntityAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const LEGAL_ENTITY_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<LegalEntityRelationKey>().one(JurisdictionConfig.JURISDICTION_AS_ONE_RELATION_CONFIG, 'jurisdiction'),
] as const;

export const LEGAL_ENTITY_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const LEGAL_ENTITY_QUERY_OPTIONS = {
  searchableFields: LEGAL_ENTITY_SEARCHABLE_FIELDS,
  selectableFields: LEGAL_ENTITY_SELECTABLE_FIELDS,
  defaultSelectFields: LEGAL_ENTITY_DEFAULT_SELECT_FIELDS,
  sortableFields: LEGAL_ENTITY_SORTABLE_FIELDS,
  filterFields: LEGAL_ENTITY_FILTERABLE_FIELDS,
  dateRangeFields: LEGAL_ENTITY_DATE_RANGE_FIELDS,
  oneRelations: LEGAL_ENTITY_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: LEGAL_ENTITY_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ILegalEntity,
  LegalEntitySortableField,
  LegalEntitySelectableField,
  LegalEntityFilterableField,
  LegalEntityDateRangeField,
  LegalEntityRelationKey,
  typeof LEGAL_ENTITY_ONE_RELATION_QUERY_OPTIONS,
  typeof LEGAL_ENTITY_MANY_RELATION_QUERY_OPTIONS
>;