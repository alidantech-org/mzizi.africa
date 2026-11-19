import type { DeviceId } from "#/modules/interactions/schema/type/device-id.type.ts";
import type { Ref } from "#/modules/interactions/schema/type/ref.type.ts";
import type { Table } from "#/modules/interactions/schema/type/table.type.ts";

/** Like Input */
export interface LikeInput {
  deviceId: DeviceId;
  subjectRef: Ref;
  subjectTable: Table;
}
