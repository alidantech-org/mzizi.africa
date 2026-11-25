import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { AppointmentStep } from "#/modules/governance/schema/enum/appointment-step.enum.ts";

/** The contract shape of OfficeDetailHoldersSteps, for generated tests. */
export const officeDetailHoldersStepsExample: ContractExample = contractExample({
  name: "OfficeDetailHoldersSteps",
  fields: [
    {
      name: "actorCode",
      optional: false,
      nullable: false,
      spec: {
        kind: "string",
        minLength: 1,
        maxLength: 255,
        patterns: [
          "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ],
      },
    },
    {
      name: "actorHolderId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "actorId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "motionId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "onDate",
      optional: false,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "step",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(AppointmentStep) },
    },
  ],
  invariants: [],
});
