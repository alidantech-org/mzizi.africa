// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IInstitutionRelationship,
  InstitutionRelationshipKey,
  InstitutionRelationshipRelationKey,
  InstitutionRelationshipSortableField,
  InstitutionRelationshipFilterableField,
  InstitutionRelationshipDateRangeField,
  InstitutionRelationshipSelectableField,
  IInstitutionRelationshipAsOneRelationConfig,
  IInstitutionRelationshipAsManyRelationConfig
} from './institution-relationship.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const INSTITUTION_RELATIONSHIP_RELATION_KEYS = [] as const satisfies readonly InstitutionRelationshipKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const INSTITUTION_RELATIONSHIP_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly InstitutionRelationshipKey[];

export const INSTITUTION_RELATIONSHIP_SEARCHABLE_FIELDS = [] as const satisfies readonly InstitutionRelationshipKey[];

export const INSTITUTION_RELATIONSHIP_FILTERABLE_FIELDS = ['id', 'isCurrent', 'kind', 'legalBasisId', 'objectId', 'objectKind', 'subjectId', 'subjectKind', 'version', ] as const satisfies readonly InstitutionRelationshipKey[];

export const INSTITUTION_RELATIONSHIP_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly InstitutionRelationshipKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const INSTITUTION_RELATIONSHIP_SELECTABLE_FIELDS = ['createdAt', 'id', 'isCurrent', 'kind', 'legalBasisId', 'objectId', 'objectKind', 'subjectId', 'subjectKind', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly InstitutionRelationshipKey[];

export const INSTITUTION_RELATIONSHIP_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly InstitutionRelationshipSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const INSTITUTION_RELATIONSHIP_EDITABLE_FIELDS = ['isCurrent', 'kind', 'legalBasisId', 'objectId', 'objectKind', 'subjectId', 'subjectKind', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly InstitutionRelationshipKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const INSTITUTION_RELATIONSHIP_AS_ONE_RELATION_CONFIG = {
  relation: 'institutionRelationship',
  type: ERelationType.One,
  selectableFields: INSTITUTION_RELATIONSHIP_SELECTABLE_FIELDS,
  defaultSelectFields: INSTITUTION_RELATIONSHIP_DEFAULT_SELECT_FIELDS
} as const satisfies IInstitutionRelationshipAsOneRelationConfig;

export const INSTITUTION_RELATIONSHIP_AS_MANY_RELATION_CONFIG = {
  relation: 'institutionRelationships',
  type: ERelationType.Many,
  selectableFields: INSTITUTION_RELATIONSHIP_SELECTABLE_FIELDS,
  defaultSelectFields: INSTITUTION_RELATIONSHIP_DEFAULT_SELECT_FIELDS,
  sortableFields: INSTITUTION_RELATIONSHIP_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IInstitutionRelationshipAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const INSTITUTION_RELATIONSHIP_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const INSTITUTION_RELATIONSHIP_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const INSTITUTION_RELATIONSHIP_QUERY_OPTIONS = {
  searchableFields: INSTITUTION_RELATIONSHIP_SEARCHABLE_FIELDS,
  selectableFields: INSTITUTION_RELATIONSHIP_SELECTABLE_FIELDS,
  defaultSelectFields: INSTITUTION_RELATIONSHIP_DEFAULT_SELECT_FIELDS,
  sortableFields: INSTITUTION_RELATIONSHIP_SORTABLE_FIELDS,
  filterFields: INSTITUTION_RELATIONSHIP_FILTERABLE_FIELDS,
  dateRangeFields: INSTITUTION_RELATIONSHIP_DATE_RANGE_FIELDS,
  oneRelations: INSTITUTION_RELATIONSHIP_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: INSTITUTION_RELATIONSHIP_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IInstitutionRelationship,
  InstitutionRelationshipSortableField,
  InstitutionRelationshipSelectableField,
  InstitutionRelationshipFilterableField,
  InstitutionRelationshipDateRangeField,
  InstitutionRelationshipRelationKey,
  typeof INSTITUTION_RELATIONSHIP_ONE_RELATION_QUERY_OPTIONS,
  typeof INSTITUTION_RELATIONSHIP_MANY_RELATION_QUERY_OPTIONS
>;