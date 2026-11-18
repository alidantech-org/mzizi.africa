import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { capacityExample } from "@test/modules/experience/schema/dto/examples/capacity.dto.example.ts";

/** The contract shape of FacilityRow, for generated tests. */
export const facilityRowExample: ContractExample = contractExample({
  name: "FacilityRow",
  fields: [
    {
      name: "capacity",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => capacityExample },
    },
    {
      name: "classCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "classLabel",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "domainCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "domainLabel",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "featureId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "latitude",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "longitude",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "operator",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "ownershipLabel",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "placeName",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "placePath",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 1000 },
    },
    {
      name: "statusLabel",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
  ],
  invariants: [],
});
