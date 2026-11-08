// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as SiteConfig from '#/modules/website/types/site.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IAssessment,
  AssessmentKey,
  AssessmentRelationKey,
  AssessmentSortableField,
  AssessmentFilterableField,
  AssessmentDateRangeField,
  AssessmentSelectableField,
  IAssessmentAsOneRelationConfig,
  IAssessmentAsManyRelationConfig
} from './assessment.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const ASSESSMENT_RELATION_KEYS = ['site', ] as const satisfies readonly AssessmentKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const ASSESSMENT_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', ] as const satisfies readonly AssessmentKey[];

export const ASSESSMENT_SEARCHABLE_FIELDS = [] as const satisfies readonly AssessmentKey[];

export const ASSESSMENT_FILTERABLE_FIELDS = ['id', 'isCurrent', 'jurisdictionId', 'reviewedBy', 'siteId', 'status', 'supersedesId', 'version', ] as const satisfies readonly AssessmentKey[];

export const ASSESSMENT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly AssessmentKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const ASSESSMENT_SELECTABLE_FIELDS = ['accessBasis', 'accessConditions', 'approvedScope', 'conditions', 'createdAt', 'evidence', 'id', 'isCurrent', 'jurisdictionId', 'lawfulBasis', 'licenceName', 'licenceUrl', 'licenceVersion', 'personalDataCategories', 'processingPurpose', 'rationale', 'reviewDueAt', 'reviewedAt', 'reviewedBy', 'rightsHolder', 'siteId', 'sourceType', 'status', 'supersedesId', 'updatedAt', ] as const satisfies readonly AssessmentKey[];

export const ASSESSMENT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly AssessmentSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const ASSESSMENT_EDITABLE_FIELDS = ['accessBasis', 'accessConditions', 'approvedScope', 'conditions', 'evidence', 'isCurrent', 'jurisdictionId', 'lawfulBasis', 'licenceName', 'licenceUrl', 'licenceVersion', 'personalDataCategories', 'processingPurpose', 'rationale', 'reviewDueAt', 'reviewedAt', 'reviewedBy', 'rightsHolder', 'siteId', 'sourceType', 'status', 'supersedesId', ] as const satisfies readonly AssessmentKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const ASSESSMENT_AS_ONE_RELATION_CONFIG = {
  relation: 'assessment',
  type: ERelationType.One,
  selectableFields: ASSESSMENT_SELECTABLE_FIELDS,
  defaultSelectFields: ASSESSMENT_DEFAULT_SELECT_FIELDS
} as const satisfies IAssessmentAsOneRelationConfig;

export const ASSESSMENT_AS_MANY_RELATION_CONFIG = {
  relation: 'assessments',
  type: ERelationType.Many,
  selectableFields: ASSESSMENT_SELECTABLE_FIELDS,
  defaultSelectFields: ASSESSMENT_DEFAULT_SELECT_FIELDS,
  sortableFields: ASSESSMENT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IAssessmentAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const ASSESSMENT_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<AssessmentRelationKey>().one(SiteConfig.SITE_AS_ONE_RELATION_CONFIG, 'site'),
] as const;

export const ASSESSMENT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const ASSESSMENT_QUERY_OPTIONS = {
  searchableFields: ASSESSMENT_SEARCHABLE_FIELDS,
  selectableFields: ASSESSMENT_SELECTABLE_FIELDS,
  defaultSelectFields: ASSESSMENT_DEFAULT_SELECT_FIELDS,
  sortableFields: ASSESSMENT_SORTABLE_FIELDS,
  filterFields: ASSESSMENT_FILTERABLE_FIELDS,
  dateRangeFields: ASSESSMENT_DATE_RANGE_FIELDS,
  oneRelations: ASSESSMENT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: ASSESSMENT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IAssessment,
  AssessmentSortableField,
  AssessmentSelectableField,
  AssessmentFilterableField,
  AssessmentDateRangeField,
  AssessmentRelationKey,
  typeof ASSESSMENT_ONE_RELATION_QUERY_OPTIONS,
  typeof ASSESSMENT_MANY_RELATION_QUERY_OPTIONS
>;