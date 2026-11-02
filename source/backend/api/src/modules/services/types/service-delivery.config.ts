// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as AmenityConfig from '#/modules/services/types/amenity.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IServiceDelivery,
  ServiceDeliveryKey,
  ServiceDeliveryRelationKey,
  ServiceDeliverySortableField,
  ServiceDeliveryFilterableField,
  ServiceDeliveryDateRangeField,
  ServiceDeliverySelectableField,
  IServiceDeliveryAsOneRelationConfig,
  IServiceDeliveryAsManyRelationConfig
} from './service-delivery.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SERVICE_DELIVERY_RELATION_KEYS = ['amenity', ] as const satisfies readonly ServiceDeliveryKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SERVICE_DELIVERY_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly ServiceDeliveryKey[];

export const SERVICE_DELIVERY_SEARCHABLE_FIELDS = [] as const satisfies readonly ServiceDeliveryKey[];

export const SERVICE_DELIVERY_FILTERABLE_FIELDS = ['amenityId', 'budgetId', 'id', 'isCurrent', 'method', 'responsibleOfficeId', 'serviceId', 'status', 'verificationState', 'version', ] as const satisfies readonly ServiceDeliveryKey[];

export const SERVICE_DELIVERY_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly ServiceDeliveryKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SERVICE_DELIVERY_SELECTABLE_FIELDS = ['amenityId', 'artifactChecksum', 'artifactId', 'budgetId', 'confidence', 'createdAt', 'id', 'isCurrent', 'licence', 'method', 'responsibleOfficeId', 'retrievedAt', 'serviceId', 'sourceName', 'sourceReference', 'sourceUrl', 'status', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly ServiceDeliveryKey[];

export const SERVICE_DELIVERY_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly ServiceDeliverySelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SERVICE_DELIVERY_EDITABLE_FIELDS = ['amenityId', 'artifactChecksum', 'artifactId', 'budgetId', 'confidence', 'isCurrent', 'licence', 'method', 'responsibleOfficeId', 'retrievedAt', 'serviceId', 'sourceName', 'sourceReference', 'sourceUrl', 'status', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly ServiceDeliveryKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SERVICE_DELIVERY_AS_ONE_RELATION_CONFIG = {
  relation: 'serviceDelivery',
  type: ERelationType.One,
  selectableFields: SERVICE_DELIVERY_SELECTABLE_FIELDS,
  defaultSelectFields: SERVICE_DELIVERY_DEFAULT_SELECT_FIELDS
} as const satisfies IServiceDeliveryAsOneRelationConfig;

export const SERVICE_DELIVERY_AS_MANY_RELATION_CONFIG = {
  relation: 'serviceDeliverys',
  type: ERelationType.Many,
  selectableFields: SERVICE_DELIVERY_SELECTABLE_FIELDS,
  defaultSelectFields: SERVICE_DELIVERY_DEFAULT_SELECT_FIELDS,
  sortableFields: SERVICE_DELIVERY_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IServiceDeliveryAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SERVICE_DELIVERY_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ServiceDeliveryRelationKey>().one(AmenityConfig.AMENITY_AS_ONE_RELATION_CONFIG, 'amenity'),
] as const;

export const SERVICE_DELIVERY_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SERVICE_DELIVERY_QUERY_OPTIONS = {
  searchableFields: SERVICE_DELIVERY_SEARCHABLE_FIELDS,
  selectableFields: SERVICE_DELIVERY_SELECTABLE_FIELDS,
  defaultSelectFields: SERVICE_DELIVERY_DEFAULT_SELECT_FIELDS,
  sortableFields: SERVICE_DELIVERY_SORTABLE_FIELDS,
  filterFields: SERVICE_DELIVERY_FILTERABLE_FIELDS,
  dateRangeFields: SERVICE_DELIVERY_DATE_RANGE_FIELDS,
  oneRelations: SERVICE_DELIVERY_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SERVICE_DELIVERY_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IServiceDelivery,
  ServiceDeliverySortableField,
  ServiceDeliverySelectableField,
  ServiceDeliveryFilterableField,
  ServiceDeliveryDateRangeField,
  ServiceDeliveryRelationKey,
  typeof SERVICE_DELIVERY_ONE_RELATION_QUERY_OPTIONS,
  typeof SERVICE_DELIVERY_MANY_RELATION_QUERY_OPTIONS
>;