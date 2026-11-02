// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { RelationKind } from '#/types/geography/relation-kind.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as GeoUnitTypes from '#/modules/geography/types/geo-unit.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  GEO_RELATIONSHIP_RELATION_KEYS,
  GEO_RELATIONSHIP_SORTABLE_FIELDS,
  GEO_RELATIONSHIP_SEARCHABLE_FIELDS,
  GEO_RELATIONSHIP_FILTERABLE_FIELDS,
  GEO_RELATIONSHIP_DATE_RANGE_FIELDS,
  GEO_RELATIONSHIP_SELECTABLE_FIELDS,
  GEO_RELATIONSHIP_DEFAULT_SELECT_FIELDS,
  GEO_RELATIONSHIP_EDITABLE_FIELDS
} from './geo-relationship.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Geo Relationship */
export interface IGeoRelationship extends B.IBase {
  childId: string;
  isCurrent: boolean;
  kind: RelationKind;
  parentId: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly geoUnit?: GeoUnitTypes.IGeoUnit;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type GeoRelationshipKey = keyof IGeoRelationship;

export type GeoRelationshipRelationKey = (typeof GEO_RELATIONSHIP_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IGeoRelationshipReadonlyFields = B.IBaseReadonlyFields;

export type IGeoRelationshipContextualFields = never;

export type IGeoRelationshipSensitiveFields = never;

export type IGeoRelationshipTransitionFields = never;

export type IGeoRelationshipImmutableFields =
  | IGeoRelationshipReadonlyFields
  | IGeoRelationshipContextualFields
  | IGeoRelationshipSensitiveFields
  | IGeoRelationshipTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IGeoRelationshipCreatable = Omit<IGeoRelationship, IGeoRelationshipImmutableFields | GeoRelationshipRelationKey>;

export type IGeoRelationshipSystemWritable = Omit<IGeoRelationship, B.IBaseReadonlyFields | GeoRelationshipRelationKey>;

export type IGeoRelationshipUpdatable = Partial<Omit<IGeoRelationship, IGeoRelationshipImmutableFields | GeoRelationshipRelationKey>>;

export interface IGeoRelationshipTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type GeoRelationshipSortableField = (typeof GEO_RELATIONSHIP_SORTABLE_FIELDS)[number];

export type GeoRelationshipSearchableField = (typeof GEO_RELATIONSHIP_SEARCHABLE_FIELDS)[number];

export type GeoRelationshipFilterableField = (typeof GEO_RELATIONSHIP_FILTERABLE_FIELDS)[number];

export type GeoRelationshipDateRangeField = (typeof GEO_RELATIONSHIP_DATE_RANGE_FIELDS)[number];

export type GeoRelationshipSelectableField = (typeof GEO_RELATIONSHIP_SELECTABLE_FIELDS)[number];

export type GeoRelationshipDefaultSelectField = (typeof GEO_RELATIONSHIP_DEFAULT_SELECT_FIELDS)[number];

export type GeoRelationshipEditableField = (typeof GEO_RELATIONSHIP_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IGeoRelationshipAsOneRelationConfig = Q.IOneRelationConfig<'geoRelationship', GeoRelationshipSelectableField>;

export type IGeoRelationshipAsManyRelationConfig = Q.IManyRelationConfig<'geoRelationships', GeoRelationshipSelectableField, GeoRelationshipSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IGeoRelationshipAsOneRelationQuery = Q.IAsOneRelationQuery<IGeoRelationship, GeoRelationshipSelectableField>;

export type IGeoRelationshipAsManyRelationQuery = Q.IAsManyRelationQuery<IGeoRelationship, GeoRelationshipSelectableField, GeoRelationshipSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IGeoRelationshipRelationMap extends Record<GeoRelationshipRelationKey, unknown> {
  geoUnit: GeoUnitTypes.IGeoUnitAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IGeoRelationshipRelationQueries = Q.IBaseRelationQueries<IGeoRelationship, GeoRelationshipRelationKey, IGeoRelationshipRelationMap>;

export type IGeoRelationshipItemQuery = Q.IBaseItemQuery<
  IGeoRelationship,
  GeoRelationshipRelationKey,
  GeoRelationshipSelectableField,
  GeoRelationshipRelationKey,
  GeoRelationshipSelectableField,
  IGeoRelationshipRelationMap,
  IGeoRelationshipRelationQueries
>;

export type IGeoRelationshipListQuery = Q.IBaseListQuery<
  IGeoRelationship,
  GeoRelationshipRelationKey,
  GeoRelationshipSelectableField,
  GeoRelationshipSortableField,
  GeoRelationshipRelationKey,
  GeoRelationshipSelectableField,
  GeoRelationshipSortableField,
  GeoRelationshipDateRangeField,
  GeoRelationshipFilterableField,
  IGeoRelationshipRelationMap,
  IGeoRelationshipRelationQueries,
  IGeoRelationshipItemQuery
>;