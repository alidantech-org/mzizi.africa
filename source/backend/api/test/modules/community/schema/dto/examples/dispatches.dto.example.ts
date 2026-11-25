import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { DispatchState } from "#/modules/community/schema/enum/dispatch-state.enum.ts";
import { devicesExample } from "@test/modules/community/schema/dto/examples/devices.dto.example.ts";
import { notificationsExample } from "@test/modules/community/schema/dto/examples/notifications.dto.example.ts";
import { subscriptionsExample } from "@test/modules/community/schema/dto/examples/subscriptions.dto.example.ts";
import { partitionedRecordExample } from "@test/modules/shared/schema/dto/examples/partitioned-record.dto.example.ts";

/** The contract shape of Dispatches, for generated tests. */
export const dispatchesExample: ContractExample = contractExample({
  name: "Dispatches",
  fields: [
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "deviceId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "notificationCreatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "notificationId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "openedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "sentAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "state",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(DispatchState) },
    },
    {
      name: "subscriptionId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [],
});
