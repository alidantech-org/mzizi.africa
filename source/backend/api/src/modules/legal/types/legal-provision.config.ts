// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as LegalInstrumentConfig from '#/modules/legal/types/legal-instrument.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ILegalProvision,
  LegalProvisionKey,
  LegalProvisionRelationKey,
  LegalProvisionSortableField,
  LegalProvisionFilterableField,
  LegalProvisionDateRangeField,
  LegalProvisionSelectableField,
  ILegalProvisionAsOneRelationConfig,
  ILegalProvisionAsManyRelationConfig
} from './legal-provision.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const LEGAL_PROVISION_RELATION_KEYS = ['legalInstrument', ] as const satisfies readonly LegalProvisionKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const LEGAL_PROVISION_SORTABLE_FIELDS = ['code', 'createdAt', 'sortOrder', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly LegalProvisionKey[];

export const LEGAL_PROVISION_SEARCHABLE_FIELDS = ['citation', 'code', 'heading', ] as const satisfies readonly LegalProvisionKey[];

export const LEGAL_PROVISION_FILTERABLE_FIELDS = ['citation', 'code', 'heading', 'id', 'instrumentId', 'isCurrent', 'kind', 'parentId', 'previousVersionId', 'version', ] as const satisfies readonly LegalProvisionKey[];

export const LEGAL_PROVISION_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly LegalProvisionKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const LEGAL_PROVISION_SELECTABLE_FIELDS = ['citation', 'code', 'content', 'createdAt', 'heading', 'id', 'instrumentId', 'isCurrent', 'kind', 'parentId', 'previousVersionId', 'sortOrder', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly LegalProvisionKey[];

export const LEGAL_PROVISION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly LegalProvisionSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const LEGAL_PROVISION_EDITABLE_FIELDS = ['citation', 'code', 'content', 'heading', 'instrumentId', 'isCurrent', 'kind', 'parentId', 'previousVersionId', 'sortOrder', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly LegalProvisionKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const LEGAL_PROVISION_AS_ONE_RELATION_CONFIG = {
  relation: 'legalProvision',
  type: ERelationType.One,
  selectableFields: LEGAL_PROVISION_SELECTABLE_FIELDS,
  defaultSelectFields: LEGAL_PROVISION_DEFAULT_SELECT_FIELDS
} as const satisfies ILegalProvisionAsOneRelationConfig;

export const LEGAL_PROVISION_AS_MANY_RELATION_CONFIG = {
  relation: 'legalProvisions',
  type: ERelationType.Many,
  selectableFields: LEGAL_PROVISION_SELECTABLE_FIELDS,
  defaultSelectFields: LEGAL_PROVISION_DEFAULT_SELECT_FIELDS,
  sortableFields: LEGAL_PROVISION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ILegalProvisionAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const LEGAL_PROVISION_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<LegalProvisionRelationKey>().one(LegalInstrumentConfig.LEGAL_INSTRUMENT_AS_ONE_RELATION_CONFIG, 'legalInstrument'),
] as const;

export const LEGAL_PROVISION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const LEGAL_PROVISION_QUERY_OPTIONS = {
  searchableFields: LEGAL_PROVISION_SEARCHABLE_FIELDS,
  selectableFields: LEGAL_PROVISION_SELECTABLE_FIELDS,
  defaultSelectFields: LEGAL_PROVISION_DEFAULT_SELECT_FIELDS,
  sortableFields: LEGAL_PROVISION_SORTABLE_FIELDS,
  filterFields: LEGAL_PROVISION_FILTERABLE_FIELDS,
  dateRangeFields: LEGAL_PROVISION_DATE_RANGE_FIELDS,
  oneRelations: LEGAL_PROVISION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: LEGAL_PROVISION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ILegalProvision,
  LegalProvisionSortableField,
  LegalProvisionSelectableField,
  LegalProvisionFilterableField,
  LegalProvisionDateRangeField,
  LegalProvisionRelationKey,
  typeof LEGAL_PROVISION_ONE_RELATION_QUERY_OPTIONS,
  typeof LEGAL_PROVISION_MANY_RELATION_QUERY_OPTIONS
>;