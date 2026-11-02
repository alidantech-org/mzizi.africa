// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DomainRole } from '#/types/website/domain-role.enum';
import type { PatternStatus } from '#/types/website/pattern-status.enum';
import type { UrlScheme } from '#/types/website/url-scheme.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as SiteFamilyTypes from '#/modules/website/types/site-family.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  DOMAIN_PATTERN_RELATION_KEYS,
  DOMAIN_PATTERN_SORTABLE_FIELDS,
  DOMAIN_PATTERN_SEARCHABLE_FIELDS,
  DOMAIN_PATTERN_FILTERABLE_FIELDS,
  DOMAIN_PATTERN_DATE_RANGE_FIELDS,
  DOMAIN_PATTERN_SELECTABLE_FIELDS,
  DOMAIN_PATTERN_DEFAULT_SELECT_FIELDS,
  DOMAIN_PATTERN_EDITABLE_FIELDS
} from './domain-pattern.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Domain Pattern */
export interface IDomainPattern extends B.IBase {
  domainRole: DomainRole;
  familyId: string;
  notes: string | null;
  scheme: UrlScheme;
  status: PatternStatus;
  template: string;
  variables: string;
  readonly siteFamily?: SiteFamilyTypes.ISiteFamily;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type DomainPatternKey = keyof IDomainPattern;

export type DomainPatternRelationKey = (typeof DOMAIN_PATTERN_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IDomainPatternReadonlyFields = B.IBaseReadonlyFields;

export type IDomainPatternContextualFields = never;

export type IDomainPatternSensitiveFields = never;

export type IDomainPatternTransitionFields = never;

export type IDomainPatternImmutableFields =
  | IDomainPatternReadonlyFields
  | IDomainPatternContextualFields
  | IDomainPatternSensitiveFields
  | IDomainPatternTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IDomainPatternCreatable = Omit<IDomainPattern, IDomainPatternImmutableFields | DomainPatternRelationKey>;

export type IDomainPatternSystemWritable = Omit<IDomainPattern, B.IBaseReadonlyFields | DomainPatternRelationKey>;

export type IDomainPatternUpdatable = Partial<Omit<IDomainPattern, IDomainPatternImmutableFields | DomainPatternRelationKey>>;

export interface IDomainPatternTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type DomainPatternSortableField = (typeof DOMAIN_PATTERN_SORTABLE_FIELDS)[number];

export type DomainPatternSearchableField = (typeof DOMAIN_PATTERN_SEARCHABLE_FIELDS)[number];

export type DomainPatternFilterableField = (typeof DOMAIN_PATTERN_FILTERABLE_FIELDS)[number];

export type DomainPatternDateRangeField = (typeof DOMAIN_PATTERN_DATE_RANGE_FIELDS)[number];

export type DomainPatternSelectableField = (typeof DOMAIN_PATTERN_SELECTABLE_FIELDS)[number];

export type DomainPatternDefaultSelectField = (typeof DOMAIN_PATTERN_DEFAULT_SELECT_FIELDS)[number];

export type DomainPatternEditableField = (typeof DOMAIN_PATTERN_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IDomainPatternAsOneRelationConfig = Q.IOneRelationConfig<'domainPattern', DomainPatternSelectableField>;

export type IDomainPatternAsManyRelationConfig = Q.IManyRelationConfig<'domainPatterns', DomainPatternSelectableField, DomainPatternSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IDomainPatternAsOneRelationQuery = Q.IAsOneRelationQuery<IDomainPattern, DomainPatternSelectableField>;

export type IDomainPatternAsManyRelationQuery = Q.IAsManyRelationQuery<IDomainPattern, DomainPatternSelectableField, DomainPatternSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IDomainPatternRelationMap extends Record<DomainPatternRelationKey, unknown> {
  siteFamily: SiteFamilyTypes.ISiteFamilyAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IDomainPatternRelationQueries = Q.IBaseRelationQueries<IDomainPattern, DomainPatternRelationKey, IDomainPatternRelationMap>;

export type IDomainPatternItemQuery = Q.IBaseItemQuery<
  IDomainPattern,
  DomainPatternRelationKey,
  DomainPatternSelectableField,
  DomainPatternRelationKey,
  DomainPatternSelectableField,
  IDomainPatternRelationMap,
  IDomainPatternRelationQueries
>;

export type IDomainPatternListQuery = Q.IBaseListQuery<
  IDomainPattern,
  DomainPatternRelationKey,
  DomainPatternSelectableField,
  DomainPatternSortableField,
  DomainPatternRelationKey,
  DomainPatternSelectableField,
  DomainPatternSortableField,
  DomainPatternDateRangeField,
  DomainPatternFilterableField,
  IDomainPatternRelationMap,
  IDomainPatternRelationQueries,
  IDomainPatternItemQuery
>;