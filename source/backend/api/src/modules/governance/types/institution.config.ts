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
  IInstitution,
  InstitutionKey,
  InstitutionRelationKey,
  InstitutionSortableField,
  InstitutionFilterableField,
  InstitutionDateRangeField,
  InstitutionSelectableField,
  IInstitutionAsOneRelationConfig,
  IInstitutionAsManyRelationConfig
} from './institution.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const INSTITUTION_RELATION_KEYS = ['jurisdiction', ] as const satisfies readonly InstitutionKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const INSTITUTION_SORTABLE_FIELDS = ['code', 'createdAt', 'name', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly InstitutionKey[];

export const INSTITUTION_SEARCHABLE_FIELDS = ['code', 'name', ] as const satisfies readonly InstitutionKey[];

export const INSTITUTION_FILTERABLE_FIELDS = ['branchId', 'code', 'id', 'isCurrent', 'jurisdictionId', 'legalBasisId', 'method', 'name', 'typeId', 'verificationState', 'version', ] as const satisfies readonly InstitutionKey[];

export const INSTITUTION_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly InstitutionKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const INSTITUTION_SELECTABLE_FIELDS = ['artifactChecksum', 'artifactId', 'branchId', 'code', 'confidence', 'createdAt', 'description', 'id', 'isCurrent', 'jurisdictionId', 'legalBasisId', 'licence', 'method', 'name', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'typeId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly InstitutionKey[];

export const INSTITUTION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly InstitutionSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const INSTITUTION_EDITABLE_FIELDS = ['artifactChecksum', 'artifactId', 'branchId', 'code', 'confidence', 'description', 'isCurrent', 'jurisdictionId', 'legalBasisId', 'licence', 'method', 'name', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'typeId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly InstitutionKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const INSTITUTION_AS_ONE_RELATION_CONFIG = {
  relation: 'institution',
  type: ERelationType.One,
  selectableFields: INSTITUTION_SELECTABLE_FIELDS,
  defaultSelectFields: INSTITUTION_DEFAULT_SELECT_FIELDS
} as const satisfies IInstitutionAsOneRelationConfig;

export const INSTITUTION_AS_MANY_RELATION_CONFIG = {
  relation: 'institutions',
  type: ERelationType.Many,
  selectableFields: INSTITUTION_SELECTABLE_FIELDS,
  defaultSelectFields: INSTITUTION_DEFAULT_SELECT_FIELDS,
  sortableFields: INSTITUTION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IInstitutionAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const INSTITUTION_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<InstitutionRelationKey>().one(JurisdictionConfig.JURISDICTION_AS_ONE_RELATION_CONFIG, 'jurisdiction'),
] as const;

export const INSTITUTION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const INSTITUTION_QUERY_OPTIONS = {
  searchableFields: INSTITUTION_SEARCHABLE_FIELDS,
  selectableFields: INSTITUTION_SELECTABLE_FIELDS,
  defaultSelectFields: INSTITUTION_DEFAULT_SELECT_FIELDS,
  sortableFields: INSTITUTION_SORTABLE_FIELDS,
  filterFields: INSTITUTION_FILTERABLE_FIELDS,
  dateRangeFields: INSTITUTION_DATE_RANGE_FIELDS,
  oneRelations: INSTITUTION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: INSTITUTION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IInstitution,
  InstitutionSortableField,
  InstitutionSelectableField,
  InstitutionFilterableField,
  InstitutionDateRangeField,
  InstitutionRelationKey,
  typeof INSTITUTION_ONE_RELATION_QUERY_OPTIONS,
  typeof INSTITUTION_MANY_RELATION_QUERY_OPTIONS
>;