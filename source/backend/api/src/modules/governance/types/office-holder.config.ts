// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as OfficeConfig from '#/modules/governance/types/office.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IOfficeHolder,
  OfficeHolderKey,
  OfficeHolderRelationKey,
  OfficeHolderSortableField,
  OfficeHolderFilterableField,
  OfficeHolderDateRangeField,
  OfficeHolderSelectableField,
  IOfficeHolderAsOneRelationConfig,
  IOfficeHolderAsManyRelationConfig
} from './office-holder.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const OFFICE_HOLDER_RELATION_KEYS = ['office', ] as const satisfies readonly OfficeHolderKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const OFFICE_HOLDER_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly OfficeHolderKey[];

export const OFFICE_HOLDER_SEARCHABLE_FIELDS = [] as const satisfies readonly OfficeHolderKey[];

export const OFFICE_HOLDER_FILTERABLE_FIELDS = ['id', 'isCurrent', 'legalBasisId', 'method', 'officeId', 'personId', 'selectionProcedureId', 'status', 'verificationState', 'version', ] as const satisfies readonly OfficeHolderKey[];

export const OFFICE_HOLDER_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly OfficeHolderKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const OFFICE_HOLDER_SELECTABLE_FIELDS = ['artifactChecksum', 'artifactId', 'confidence', 'createdAt', 'departureReason', 'id', 'isCurrent', 'legalBasisId', 'licence', 'method', 'officeId', 'personId', 'retrievedAt', 'selectionProcedureId', 'sourceName', 'sourceReference', 'sourceUrl', 'status', 'termNumber', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly OfficeHolderKey[];

export const OFFICE_HOLDER_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly OfficeHolderSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const OFFICE_HOLDER_EDITABLE_FIELDS = ['artifactChecksum', 'artifactId', 'confidence', 'departureReason', 'isCurrent', 'legalBasisId', 'licence', 'method', 'officeId', 'personId', 'retrievedAt', 'selectionProcedureId', 'sourceName', 'sourceReference', 'sourceUrl', 'status', 'termNumber', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly OfficeHolderKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const OFFICE_HOLDER_AS_ONE_RELATION_CONFIG = {
  relation: 'officeHolder',
  type: ERelationType.One,
  selectableFields: OFFICE_HOLDER_SELECTABLE_FIELDS,
  defaultSelectFields: OFFICE_HOLDER_DEFAULT_SELECT_FIELDS
} as const satisfies IOfficeHolderAsOneRelationConfig;

export const OFFICE_HOLDER_AS_MANY_RELATION_CONFIG = {
  relation: 'officeHolders',
  type: ERelationType.Many,
  selectableFields: OFFICE_HOLDER_SELECTABLE_FIELDS,
  defaultSelectFields: OFFICE_HOLDER_DEFAULT_SELECT_FIELDS,
  sortableFields: OFFICE_HOLDER_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IOfficeHolderAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const OFFICE_HOLDER_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<OfficeHolderRelationKey>().one(OfficeConfig.OFFICE_AS_ONE_RELATION_CONFIG, 'office'),
] as const;

export const OFFICE_HOLDER_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const OFFICE_HOLDER_QUERY_OPTIONS = {
  searchableFields: OFFICE_HOLDER_SEARCHABLE_FIELDS,
  selectableFields: OFFICE_HOLDER_SELECTABLE_FIELDS,
  defaultSelectFields: OFFICE_HOLDER_DEFAULT_SELECT_FIELDS,
  sortableFields: OFFICE_HOLDER_SORTABLE_FIELDS,
  filterFields: OFFICE_HOLDER_FILTERABLE_FIELDS,
  dateRangeFields: OFFICE_HOLDER_DATE_RANGE_FIELDS,
  oneRelations: OFFICE_HOLDER_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: OFFICE_HOLDER_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IOfficeHolder,
  OfficeHolderSortableField,
  OfficeHolderSelectableField,
  OfficeHolderFilterableField,
  OfficeHolderDateRangeField,
  OfficeHolderRelationKey,
  typeof OFFICE_HOLDER_ONE_RELATION_QUERY_OPTIONS,
  typeof OFFICE_HOLDER_MANY_RELATION_QUERY_OPTIONS
>;