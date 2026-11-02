// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as LegalEntityTypes from '#/modules/entities/types/legal-entity.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  ENTITY_LOCATION_RELATION_KEYS,
  ENTITY_LOCATION_SORTABLE_FIELDS,
  ENTITY_LOCATION_SEARCHABLE_FIELDS,
  ENTITY_LOCATION_FILTERABLE_FIELDS,
  ENTITY_LOCATION_DATE_RANGE_FIELDS,
  ENTITY_LOCATION_SELECTABLE_FIELDS,
  ENTITY_LOCATION_DEFAULT_SELECT_FIELDS,
  ENTITY_LOCATION_EDITABLE_FIELDS
} from './entity-location.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Entity Location */
export interface IEntityLocation extends B.IBase {
  addressText: string | null;
  artifactChecksum: string | null;
  artifactId: string | null;
  confidence: number | null;
  entityId: string;
  geoUnitId: string | null;
  isCurrent: boolean;
  kindId: string | null;
  licence: string | null;
  method: ProvenanceMethod;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  toolOrModel: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  readonly legalEntity?: LegalEntityTypes.ILegalEntity;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type EntityLocationKey = keyof IEntityLocation;

export type EntityLocationRelationKey = (typeof ENTITY_LOCATION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IEntityLocationReadonlyFields = B.IBaseReadonlyFields;

export type IEntityLocationContextualFields = never;

export type IEntityLocationSensitiveFields = never;

export type IEntityLocationTransitionFields = never;

export type IEntityLocationImmutableFields =
  | IEntityLocationReadonlyFields
  | IEntityLocationContextualFields
  | IEntityLocationSensitiveFields
  | IEntityLocationTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IEntityLocationCreatable = Omit<IEntityLocation, IEntityLocationImmutableFields | EntityLocationRelationKey>;

export type IEntityLocationSystemWritable = Omit<IEntityLocation, B.IBaseReadonlyFields | EntityLocationRelationKey>;

export type IEntityLocationUpdatable = Partial<Omit<IEntityLocation, IEntityLocationImmutableFields | EntityLocationRelationKey>>;

export interface IEntityLocationTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type EntityLocationSortableField = (typeof ENTITY_LOCATION_SORTABLE_FIELDS)[number];

export type EntityLocationSearchableField = (typeof ENTITY_LOCATION_SEARCHABLE_FIELDS)[number];

export type EntityLocationFilterableField = (typeof ENTITY_LOCATION_FILTERABLE_FIELDS)[number];

export type EntityLocationDateRangeField = (typeof ENTITY_LOCATION_DATE_RANGE_FIELDS)[number];

export type EntityLocationSelectableField = (typeof ENTITY_LOCATION_SELECTABLE_FIELDS)[number];

export type EntityLocationDefaultSelectField = (typeof ENTITY_LOCATION_DEFAULT_SELECT_FIELDS)[number];

export type EntityLocationEditableField = (typeof ENTITY_LOCATION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IEntityLocationAsOneRelationConfig = Q.IOneRelationConfig<'entityLocation', EntityLocationSelectableField>;

export type IEntityLocationAsManyRelationConfig = Q.IManyRelationConfig<'entityLocations', EntityLocationSelectableField, EntityLocationSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IEntityLocationAsOneRelationQuery = Q.IAsOneRelationQuery<IEntityLocation, EntityLocationSelectableField>;

export type IEntityLocationAsManyRelationQuery = Q.IAsManyRelationQuery<IEntityLocation, EntityLocationSelectableField, EntityLocationSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IEntityLocationRelationMap extends Record<EntityLocationRelationKey, unknown> {
  legalEntity: LegalEntityTypes.ILegalEntityAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IEntityLocationRelationQueries = Q.IBaseRelationQueries<IEntityLocation, EntityLocationRelationKey, IEntityLocationRelationMap>;

export type IEntityLocationItemQuery = Q.IBaseItemQuery<
  IEntityLocation,
  EntityLocationRelationKey,
  EntityLocationSelectableField,
  EntityLocationRelationKey,
  EntityLocationSelectableField,
  IEntityLocationRelationMap,
  IEntityLocationRelationQueries
>;

export type IEntityLocationListQuery = Q.IBaseListQuery<
  IEntityLocation,
  EntityLocationRelationKey,
  EntityLocationSelectableField,
  EntityLocationSortableField,
  EntityLocationRelationKey,
  EntityLocationSelectableField,
  EntityLocationSortableField,
  EntityLocationDateRangeField,
  EntityLocationFilterableField,
  IEntityLocationRelationMap,
  IEntityLocationRelationQueries,
  IEntityLocationItemQuery
>;