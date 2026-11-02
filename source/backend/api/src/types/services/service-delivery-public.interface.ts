
import type { DeliveryStatus } from "#/types/services/delivery-status.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Amenity } from "#/types/services/amenity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Service Delivery Public */
export interface ServiceDeliveryPublic {
  amenityId: Id;
  budgetId?: Id | null;
  createdAt: DateTime;
  id: Id;
  isCurrent: Flag;
  responsibleOfficeId?: Id | null;
  serviceId: Id;
  status: DeliveryStatus;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}