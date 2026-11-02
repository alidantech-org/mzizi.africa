// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DeliveryStatus } from '#/types/services/delivery-status.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as AmenityTypes from '#/modules/services/types/amenity.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SERVICE_DELIVERY_RELATION_KEYS,
  SERVICE_DELIVERY_SORTABLE_FIELDS,
  SERVICE_DELIVERY_SEARCHABLE_FIELDS,
  SERVICE_DELIVERY_FILTERABLE_FIELDS,
  SERVICE_DELIVERY_DATE_RANGE_FIELDS,
  SERVICE_DELIVERY_SELECTABLE_FIELDS,
  SERVICE_DELIVERY_DEFAULT_SELECT_FIELDS,
  SERVICE_DELIVERY_EDITABLE_FIELDS
} from './service-delivery.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Service Delivery */
export interface IServiceDelivery extends B.IBase {
  amenityId: string;
  artifactChecksum: string | null;
  artifactId: string | null;
  budgetId: string | null;
  confidence: number | null;
  isCurrent: boolean;
  licence: string | null;
  method: ProvenanceMethod;
  responsibleOfficeId: string | null;
  retrievedAt: Date | null;
  serviceId: string;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  status: DeliveryStatus;
  toolOrModel: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  readonly amenity?: AmenityTypes.IAmenity;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ServiceDeliveryKey = keyof IServiceDelivery;

export type ServiceDeliveryRelationKey = (typeof SERVICE_DELIVERY_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IServiceDeliveryReadonlyFields = B.IBaseReadonlyFields;

export type IServiceDeliveryContextualFields = never;

export type IServiceDeliverySensitiveFields = never;

export type IServiceDeliveryTransitionFields = never;

export type IServiceDeliveryImmutableFields =
  | IServiceDeliveryReadonlyFields
  | IServiceDeliveryContextualFields
  | IServiceDeliverySensitiveFields
  | IServiceDeliveryTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IServiceDeliveryCreatable = Omit<IServiceDelivery, IServiceDeliveryImmutableFields | ServiceDeliveryRelationKey>;

export type IServiceDeliverySystemWritable = Omit<IServiceDelivery, B.IBaseReadonlyFields | ServiceDeliveryRelationKey>;

export type IServiceDeliveryUpdatable = Partial<Omit<IServiceDelivery, IServiceDeliveryImmutableFields | ServiceDeliveryRelationKey>>;

export interface IServiceDeliveryTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ServiceDeliverySortableField = (typeof SERVICE_DELIVERY_SORTABLE_FIELDS)[number];

export type ServiceDeliverySearchableField = (typeof SERVICE_DELIVERY_SEARCHABLE_FIELDS)[number];

export type ServiceDeliveryFilterableField = (typeof SERVICE_DELIVERY_FILTERABLE_FIELDS)[number];

export type ServiceDeliveryDateRangeField = (typeof SERVICE_DELIVERY_DATE_RANGE_FIELDS)[number];

export type ServiceDeliverySelectableField = (typeof SERVICE_DELIVERY_SELECTABLE_FIELDS)[number];

export type ServiceDeliveryDefaultSelectField = (typeof SERVICE_DELIVERY_DEFAULT_SELECT_FIELDS)[number];

export type ServiceDeliveryEditableField = (typeof SERVICE_DELIVERY_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IServiceDeliveryAsOneRelationConfig = Q.IOneRelationConfig<'serviceDelivery', ServiceDeliverySelectableField>;

export type IServiceDeliveryAsManyRelationConfig = Q.IManyRelationConfig<'serviceDeliverys', ServiceDeliverySelectableField, ServiceDeliverySortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IServiceDeliveryAsOneRelationQuery = Q.IAsOneRelationQuery<IServiceDelivery, ServiceDeliverySelectableField>;

export type IServiceDeliveryAsManyRelationQuery = Q.IAsManyRelationQuery<IServiceDelivery, ServiceDeliverySelectableField, ServiceDeliverySortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IServiceDeliveryRelationMap extends Record<ServiceDeliveryRelationKey, unknown> {
  amenity: AmenityTypes.IAmenityAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IServiceDeliveryRelationQueries = Q.IBaseRelationQueries<IServiceDelivery, ServiceDeliveryRelationKey, IServiceDeliveryRelationMap>;

export type IServiceDeliveryItemQuery = Q.IBaseItemQuery<
  IServiceDelivery,
  ServiceDeliveryRelationKey,
  ServiceDeliverySelectableField,
  ServiceDeliveryRelationKey,
  ServiceDeliverySelectableField,
  IServiceDeliveryRelationMap,
  IServiceDeliveryRelationQueries
>;

export type IServiceDeliveryListQuery = Q.IBaseListQuery<
  IServiceDelivery,
  ServiceDeliveryRelationKey,
  ServiceDeliverySelectableField,
  ServiceDeliverySortableField,
  ServiceDeliveryRelationKey,
  ServiceDeliverySelectableField,
  ServiceDeliverySortableField,
  ServiceDeliveryDateRangeField,
  ServiceDeliveryFilterableField,
  IServiceDeliveryRelationMap,
  IServiceDeliveryRelationQueries,
  IServiceDeliveryItemQuery
>;