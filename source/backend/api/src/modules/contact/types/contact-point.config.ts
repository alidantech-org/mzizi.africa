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
  IContactPoint,
  ContactPointKey,
  ContactPointRelationKey,
  ContactPointSortableField,
  ContactPointFilterableField,
  ContactPointDateRangeField,
  ContactPointSelectableField,
  IContactPointAsOneRelationConfig,
  IContactPointAsManyRelationConfig
} from './contact-point.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const CONTACT_POINT_RELATION_KEYS = [] as const satisfies readonly ContactPointKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const CONTACT_POINT_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly ContactPointKey[];

export const CONTACT_POINT_SEARCHABLE_FIELDS = [] as const satisfies readonly ContactPointKey[];

export const CONTACT_POINT_FILTERABLE_FIELDS = ['channel', 'id', 'isCurrent', 'scopeId', 'scopeKind', 'version', 'visibility', ] as const satisfies readonly ContactPointKey[];

export const CONTACT_POINT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly ContactPointKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const CONTACT_POINT_SELECTABLE_FIELDS = ['channel', 'createdAt', 'id', 'isCurrent', 'label', 'scopeId', 'scopeKind', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'value', 'visibility', ] as const satisfies readonly ContactPointKey[];

export const CONTACT_POINT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly ContactPointSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const CONTACT_POINT_EDITABLE_FIELDS = ['channel', 'isCurrent', 'label', 'scopeId', 'scopeKind', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'value', 'visibility', ] as const satisfies readonly ContactPointKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const CONTACT_POINT_AS_ONE_RELATION_CONFIG = {
  relation: 'contactPoint',
  type: ERelationType.One,
  selectableFields: CONTACT_POINT_SELECTABLE_FIELDS,
  defaultSelectFields: CONTACT_POINT_DEFAULT_SELECT_FIELDS
} as const satisfies IContactPointAsOneRelationConfig;

export const CONTACT_POINT_AS_MANY_RELATION_CONFIG = {
  relation: 'contactPoints',
  type: ERelationType.Many,
  selectableFields: CONTACT_POINT_SELECTABLE_FIELDS,
  defaultSelectFields: CONTACT_POINT_DEFAULT_SELECT_FIELDS,
  sortableFields: CONTACT_POINT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IContactPointAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const CONTACT_POINT_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const CONTACT_POINT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const CONTACT_POINT_QUERY_OPTIONS = {
  searchableFields: CONTACT_POINT_SEARCHABLE_FIELDS,
  selectableFields: CONTACT_POINT_SELECTABLE_FIELDS,
  defaultSelectFields: CONTACT_POINT_DEFAULT_SELECT_FIELDS,
  sortableFields: CONTACT_POINT_SORTABLE_FIELDS,
  filterFields: CONTACT_POINT_FILTERABLE_FIELDS,
  dateRangeFields: CONTACT_POINT_DATE_RANGE_FIELDS,
  oneRelations: CONTACT_POINT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: CONTACT_POINT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IContactPoint,
  ContactPointSortableField,
  ContactPointSelectableField,
  ContactPointFilterableField,
  ContactPointDateRangeField,
  ContactPointRelationKey,
  typeof CONTACT_POINT_ONE_RELATION_QUERY_OPTIONS,
  typeof CONTACT_POINT_MANY_RELATION_QUERY_OPTIONS
>;