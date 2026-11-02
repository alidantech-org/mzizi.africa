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
  IOfficeRule,
  OfficeRuleKey,
  OfficeRuleRelationKey,
  OfficeRuleSortableField,
  OfficeRuleFilterableField,
  OfficeRuleDateRangeField,
  OfficeRuleSelectableField,
  IOfficeRuleAsOneRelationConfig,
  IOfficeRuleAsManyRelationConfig
} from './office-rule.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const OFFICE_RULE_RELATION_KEYS = ['office', ] as const satisfies readonly OfficeRuleKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const OFFICE_RULE_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly OfficeRuleKey[];

export const OFFICE_RULE_SEARCHABLE_FIELDS = [] as const satisfies readonly OfficeRuleKey[];

export const OFFICE_RULE_FILTERABLE_FIELDS = ['id', 'isCurrent', 'kind', 'legalBasisId', 'method', 'officeId', 'verificationState', 'version', ] as const satisfies readonly OfficeRuleKey[];

export const OFFICE_RULE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly OfficeRuleKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const OFFICE_RULE_SELECTABLE_FIELDS = ['artifactChecksum', 'artifactId', 'confidence', 'createdAt', 'id', 'isCurrent', 'kind', 'legalBasisId', 'licence', 'method', 'numericValue', 'officeId', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'textValue', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly OfficeRuleKey[];

export const OFFICE_RULE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly OfficeRuleSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const OFFICE_RULE_EDITABLE_FIELDS = ['artifactChecksum', 'artifactId', 'confidence', 'isCurrent', 'kind', 'legalBasisId', 'licence', 'method', 'numericValue', 'officeId', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'textValue', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly OfficeRuleKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const OFFICE_RULE_AS_ONE_RELATION_CONFIG = {
  relation: 'officeRule',
  type: ERelationType.One,
  selectableFields: OFFICE_RULE_SELECTABLE_FIELDS,
  defaultSelectFields: OFFICE_RULE_DEFAULT_SELECT_FIELDS
} as const satisfies IOfficeRuleAsOneRelationConfig;

export const OFFICE_RULE_AS_MANY_RELATION_CONFIG = {
  relation: 'officeRules',
  type: ERelationType.Many,
  selectableFields: OFFICE_RULE_SELECTABLE_FIELDS,
  defaultSelectFields: OFFICE_RULE_DEFAULT_SELECT_FIELDS,
  sortableFields: OFFICE_RULE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IOfficeRuleAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const OFFICE_RULE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<OfficeRuleRelationKey>().one(OfficeConfig.OFFICE_AS_ONE_RELATION_CONFIG, 'office'),
] as const;

export const OFFICE_RULE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const OFFICE_RULE_QUERY_OPTIONS = {
  searchableFields: OFFICE_RULE_SEARCHABLE_FIELDS,
  selectableFields: OFFICE_RULE_SELECTABLE_FIELDS,
  defaultSelectFields: OFFICE_RULE_DEFAULT_SELECT_FIELDS,
  sortableFields: OFFICE_RULE_SORTABLE_FIELDS,
  filterFields: OFFICE_RULE_FILTERABLE_FIELDS,
  dateRangeFields: OFFICE_RULE_DATE_RANGE_FIELDS,
  oneRelations: OFFICE_RULE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: OFFICE_RULE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IOfficeRule,
  OfficeRuleSortableField,
  OfficeRuleSelectableField,
  OfficeRuleFilterableField,
  OfficeRuleDateRangeField,
  OfficeRuleRelationKey,
  typeof OFFICE_RULE_ONE_RELATION_QUERY_OPTIONS,
  typeof OFFICE_RULE_MANY_RELATION_QUERY_OPTIONS
>;