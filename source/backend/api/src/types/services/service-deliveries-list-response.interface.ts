
import type { ServiceDeliveryPublic } from "#/types/services/service-delivery-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Service Deliveries List Response */
export interface ServiceDeliveriesListResponse {
  deliveries: ServiceDeliveryPublic[];
  meta: PaginationMeta;
}