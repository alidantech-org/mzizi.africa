// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { RelationshipKind } from '#/types/governance/relationship-kind.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  INSTITUTION_RELATIONSHIP_RELATION_KEYS,
  INSTITUTION_RELATIONSHIP_SORTABLE_FIELDS,
  INSTITUTION_RELATIONSHIP_SEARCHABLE_FIELDS,
  INSTITUTION_RELATIONSHIP_FILTERABLE_FIELDS,
  INSTITUTION_RELATIONSHIP_DATE_RANGE_FIELDS,
  INSTITUTION_RELATIONSHIP_SELECTABLE_FIELDS,
  INSTITUTION_RELATIONSHIP_DEFAULT_SELECT_FIELDS,
  INSTITUTION_RELATIONSHIP_EDITABLE_FIELDS
} from './institution-relationship.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Institution Relationship */
export interface IInstitutionRelationship extends B.IBase {
  isCurrent: boolean;
  kind: RelationshipKind;
  legalBasisId: string | null;
  objectId: string;
  objectKind: string;
  subjectId: string;
  subjectKind: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type InstitutionRelationshipKey = keyof IInstitutionRelationship;

export type InstitutionRelationshipRelationKey = (typeof INSTITUTION_RELATIONSHIP_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IInstitutionRelationshipReadonlyFields = B.IBaseReadonlyFields;

export type IInstitutionRelationshipContextualFields = never;

export type IInstitutionRelationshipSensitiveFields = never;

export type IInstitutionRelationshipTransitionFields = never;

export type IInstitutionRelationshipImmutableFields =
  | IInstitutionRelationshipReadonlyFields
  | IInstitutionRelationshipContextualFields
  | IInstitutionRelationshipSensitiveFields
  | IInstitutionRelationshipTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IInstitutionRelationshipCreatable = Omit<IInstitutionRelationship, IInstitutionRelationshipImmutableFields | InstitutionRelationshipRelationKey>;

export type IInstitutionRelationshipSystemWritable = Omit<IInstitutionRelationship, B.IBaseReadonlyFields | InstitutionRelationshipRelationKey>;

export type IInstitutionRelationshipUpdatable = Partial<Omit<IInstitutionRelationship, IInstitutionRelationshipImmutableFields | InstitutionRelationshipRelationKey>>;

export interface IInstitutionRelationshipTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type InstitutionRelationshipSortableField = (typeof INSTITUTION_RELATIONSHIP_SORTABLE_FIELDS)[number];

export type InstitutionRelationshipSearchableField = (typeof INSTITUTION_RELATIONSHIP_SEARCHABLE_FIELDS)[number];

export type InstitutionRelationshipFilterableField = (typeof INSTITUTION_RELATIONSHIP_FILTERABLE_FIELDS)[number];

export type InstitutionRelationshipDateRangeField = (typeof INSTITUTION_RELATIONSHIP_DATE_RANGE_FIELDS)[number];

export type InstitutionRelationshipSelectableField = (typeof INSTITUTION_RELATIONSHIP_SELECTABLE_FIELDS)[number];

export type InstitutionRelationshipDefaultSelectField = (typeof INSTITUTION_RELATIONSHIP_DEFAULT_SELECT_FIELDS)[number];

export type InstitutionRelationshipEditableField = (typeof INSTITUTION_RELATIONSHIP_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IInstitutionRelationshipAsOneRelationConfig = Q.IOneRelationConfig<'institutionRelationship', InstitutionRelationshipSelectableField>;

export type IInstitutionRelationshipAsManyRelationConfig = Q.IManyRelationConfig<'institutionRelationships', InstitutionRelationshipSelectableField, InstitutionRelationshipSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IInstitutionRelationshipAsOneRelationQuery = Q.IAsOneRelationQuery<IInstitutionRelationship, InstitutionRelationshipSelectableField>;

export type IInstitutionRelationshipAsManyRelationQuery = Q.IAsManyRelationQuery<IInstitutionRelationship, InstitutionRelationshipSelectableField, InstitutionRelationshipSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IInstitutionRelationshipRelationMap extends Record<InstitutionRelationshipRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IInstitutionRelationshipRelationQueries = Q.IBaseRelationQueries<IInstitutionRelationship, InstitutionRelationshipRelationKey, IInstitutionRelationshipRelationMap>;

export type IInstitutionRelationshipItemQuery = Q.IBaseItemQuery<
  IInstitutionRelationship,
  InstitutionRelationshipRelationKey,
  InstitutionRelationshipSelectableField,
  InstitutionRelationshipRelationKey,
  InstitutionRelationshipSelectableField,
  IInstitutionRelationshipRelationMap,
  IInstitutionRelationshipRelationQueries
>;

export type IInstitutionRelationshipListQuery = Q.IBaseListQuery<
  IInstitutionRelationship,
  InstitutionRelationshipRelationKey,
  InstitutionRelationshipSelectableField,
  InstitutionRelationshipSortableField,
  InstitutionRelationshipRelationKey,
  InstitutionRelationshipSelectableField,
  InstitutionRelationshipSortableField,
  InstitutionRelationshipDateRangeField,
  InstitutionRelationshipFilterableField,
  IInstitutionRelationshipRelationMap,
  IInstitutionRelationshipRelationQueries,
  IInstitutionRelationshipItemQuery
>;