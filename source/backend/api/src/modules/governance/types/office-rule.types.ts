// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { RuleKind } from '#/types/governance/rule-kind.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as OfficeTypes from '#/modules/governance/types/office.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  OFFICE_RULE_RELATION_KEYS,
  OFFICE_RULE_SORTABLE_FIELDS,
  OFFICE_RULE_SEARCHABLE_FIELDS,
  OFFICE_RULE_FILTERABLE_FIELDS,
  OFFICE_RULE_DATE_RANGE_FIELDS,
  OFFICE_RULE_SELECTABLE_FIELDS,
  OFFICE_RULE_DEFAULT_SELECT_FIELDS,
  OFFICE_RULE_EDITABLE_FIELDS
} from './office-rule.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Office Rule */
export interface IOfficeRule extends B.IBase {
  isCurrent: boolean;
  kind: RuleKind;
  legalBasisId: string | null;
  numericValue: number | null;
  officeId: string;
  textValue: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly office?: OfficeTypes.IOffice;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type OfficeRuleKey = keyof IOfficeRule;

export type OfficeRuleRelationKey = (typeof OFFICE_RULE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IOfficeRuleReadonlyFields = B.IBaseReadonlyFields;

export type IOfficeRuleContextualFields = never;

export type IOfficeRuleSensitiveFields = never;

export type IOfficeRuleTransitionFields = never;

export type IOfficeRuleImmutableFields =
  | IOfficeRuleReadonlyFields
  | IOfficeRuleContextualFields
  | IOfficeRuleSensitiveFields
  | IOfficeRuleTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IOfficeRuleCreatable = Omit<IOfficeRule, IOfficeRuleImmutableFields | OfficeRuleRelationKey>;

export type IOfficeRuleSystemWritable = Omit<IOfficeRule, B.IBaseReadonlyFields | OfficeRuleRelationKey>;

export type IOfficeRuleUpdatable = Partial<Omit<IOfficeRule, IOfficeRuleImmutableFields | OfficeRuleRelationKey>>;

export interface IOfficeRuleTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type OfficeRuleSortableField = (typeof OFFICE_RULE_SORTABLE_FIELDS)[number];

export type OfficeRuleSearchableField = (typeof OFFICE_RULE_SEARCHABLE_FIELDS)[number];

export type OfficeRuleFilterableField = (typeof OFFICE_RULE_FILTERABLE_FIELDS)[number];

export type OfficeRuleDateRangeField = (typeof OFFICE_RULE_DATE_RANGE_FIELDS)[number];

export type OfficeRuleSelectableField = (typeof OFFICE_RULE_SELECTABLE_FIELDS)[number];

export type OfficeRuleDefaultSelectField = (typeof OFFICE_RULE_DEFAULT_SELECT_FIELDS)[number];

export type OfficeRuleEditableField = (typeof OFFICE_RULE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IOfficeRuleAsOneRelationConfig = Q.IOneRelationConfig<'officeRule', OfficeRuleSelectableField>;

export type IOfficeRuleAsManyRelationConfig = Q.IManyRelationConfig<'officeRules', OfficeRuleSelectableField, OfficeRuleSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IOfficeRuleAsOneRelationQuery = Q.IAsOneRelationQuery<IOfficeRule, OfficeRuleSelectableField>;

export type IOfficeRuleAsManyRelationQuery = Q.IAsManyRelationQuery<IOfficeRule, OfficeRuleSelectableField, OfficeRuleSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IOfficeRuleRelationMap extends Record<OfficeRuleRelationKey, unknown> {
  office: OfficeTypes.IOfficeAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IOfficeRuleRelationQueries = Q.IBaseRelationQueries<IOfficeRule, OfficeRuleRelationKey, IOfficeRuleRelationMap>;

export type IOfficeRuleItemQuery = Q.IBaseItemQuery<
  IOfficeRule,
  OfficeRuleRelationKey,
  OfficeRuleSelectableField,
  OfficeRuleRelationKey,
  OfficeRuleSelectableField,
  IOfficeRuleRelationMap,
  IOfficeRuleRelationQueries
>;

export type IOfficeRuleListQuery = Q.IBaseListQuery<
  IOfficeRule,
  OfficeRuleRelationKey,
  OfficeRuleSelectableField,
  OfficeRuleSortableField,
  OfficeRuleRelationKey,
  OfficeRuleSelectableField,
  OfficeRuleSortableField,
  OfficeRuleDateRangeField,
  OfficeRuleFilterableField,
  IOfficeRuleRelationMap,
  IOfficeRuleRelationQueries,
  IOfficeRuleItemQuery
>;