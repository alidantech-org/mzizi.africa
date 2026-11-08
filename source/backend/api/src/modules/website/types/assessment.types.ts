// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { AccessBasis } from '#/types/website/access-basis.enum';
import type { AssessmentSourceType } from '#/types/website/assessment-source-type.enum';
import type { LegalReviewStatus } from '#/types/website/legal-review-status.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as SiteTypes from '#/modules/website/types/site.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  ASSESSMENT_RELATION_KEYS,
  ASSESSMENT_SORTABLE_FIELDS,
  ASSESSMENT_SEARCHABLE_FIELDS,
  ASSESSMENT_FILTERABLE_FIELDS,
  ASSESSMENT_DATE_RANGE_FIELDS,
  ASSESSMENT_SELECTABLE_FIELDS,
  ASSESSMENT_DEFAULT_SELECT_FIELDS,
  ASSESSMENT_EDITABLE_FIELDS
} from './assessment.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Assessment */
export interface IAssessment extends B.IBase {
  accessBasis: AccessBasis;
  accessConditions: string | null;
  approvedScope: string;
  conditions: string | null;
  evidence: string | null;
  isCurrent: boolean;
  jurisdictionId: string | null;
  lawfulBasis: string | null;
  licenceName: string | null;
  licenceUrl: string | null;
  licenceVersion: string | null;
  personalDataCategories: string;
  processingPurpose: string | null;
  rationale: string | null;
  reviewDueAt: Date | null;
  reviewedAt: Date | null;
  reviewedBy: string | null;
  rightsHolder: string;
  siteId: string;
  sourceType: AssessmentSourceType;
  status: LegalReviewStatus;
  supersedesId: string | null;
  readonly site?: SiteTypes.ISite;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type AssessmentKey = keyof IAssessment;

export type AssessmentRelationKey = (typeof ASSESSMENT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IAssessmentReadonlyFields = B.IBaseReadonlyFields;

export type IAssessmentContextualFields = never;

export type IAssessmentSensitiveFields = never;

export type IAssessmentTransitionFields = never;

export type IAssessmentImmutableFields =
  | IAssessmentReadonlyFields
  | IAssessmentContextualFields
  | IAssessmentSensitiveFields
  | IAssessmentTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IAssessmentCreatable = Omit<IAssessment, IAssessmentImmutableFields | AssessmentRelationKey>;

export type IAssessmentSystemWritable = Omit<IAssessment, B.IBaseReadonlyFields | AssessmentRelationKey>;

export type IAssessmentUpdatable = Partial<Omit<IAssessment, IAssessmentImmutableFields | AssessmentRelationKey>>;

export interface IAssessmentTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type AssessmentSortableField = (typeof ASSESSMENT_SORTABLE_FIELDS)[number];

export type AssessmentSearchableField = (typeof ASSESSMENT_SEARCHABLE_FIELDS)[number];

export type AssessmentFilterableField = (typeof ASSESSMENT_FILTERABLE_FIELDS)[number];

export type AssessmentDateRangeField = (typeof ASSESSMENT_DATE_RANGE_FIELDS)[number];

export type AssessmentSelectableField = (typeof ASSESSMENT_SELECTABLE_FIELDS)[number];

export type AssessmentDefaultSelectField = (typeof ASSESSMENT_DEFAULT_SELECT_FIELDS)[number];

export type AssessmentEditableField = (typeof ASSESSMENT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IAssessmentAsOneRelationConfig = Q.IOneRelationConfig<'assessment', AssessmentSelectableField>;

export type IAssessmentAsManyRelationConfig = Q.IManyRelationConfig<'assessments', AssessmentSelectableField, AssessmentSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IAssessmentAsOneRelationQuery = Q.IAsOneRelationQuery<IAssessment, AssessmentSelectableField>;

export type IAssessmentAsManyRelationQuery = Q.IAsManyRelationQuery<IAssessment, AssessmentSelectableField, AssessmentSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IAssessmentRelationMap extends Record<AssessmentRelationKey, unknown> {
  site: SiteTypes.ISiteAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IAssessmentRelationQueries = Q.IBaseRelationQueries<IAssessment, AssessmentRelationKey, IAssessmentRelationMap>;

export type IAssessmentItemQuery = Q.IBaseItemQuery<
  IAssessment,
  AssessmentRelationKey,
  AssessmentSelectableField,
  AssessmentRelationKey,
  AssessmentSelectableField,
  IAssessmentRelationMap,
  IAssessmentRelationQueries
>;

export type IAssessmentListQuery = Q.IBaseListQuery<
  IAssessment,
  AssessmentRelationKey,
  AssessmentSelectableField,
  AssessmentSortableField,
  AssessmentRelationKey,
  AssessmentSelectableField,
  AssessmentSortableField,
  AssessmentDateRangeField,
  AssessmentFilterableField,
  IAssessmentRelationMap,
  IAssessmentRelationQueries,
  IAssessmentItemQuery
>;