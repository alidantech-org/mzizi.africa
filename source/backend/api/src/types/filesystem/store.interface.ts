
import type { StorageTier } from "#/types/filesystem/storage-tier.enum.ts";
import type { StoreKind } from "#/types/filesystem/store-kind.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Store */
export interface Store {
  code: BusinessCode;
  configurationName: Label;
  createdAt: DateTime;
  id: Id;
  isActive: Flag;
  kind: StoreKind;
  region?: Label | null;
  tier: StorageTier;
  updatedAt: DateTime;
  version: Version;
}