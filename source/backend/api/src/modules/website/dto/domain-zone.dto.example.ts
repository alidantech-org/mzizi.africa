import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { baseEntityExample } from "#/modules/shared/dto/base-entity.dto.example.ts";

/** The contract shape of DomainZone, for generated tests. */
export const domainZoneExample: ContractExample = contractExample({
  name: "DomainZone",
  fields: [
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "operator",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1 },
    },
    {
      name: "parentSuffix",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 253 },
    },
    {
      name: "purpose",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1 },
    },
    {
      name: "secondLevelOpen",
      optional: true,
      nullable: true,
      spec: { kind: "boolean" },
    },
    {
      name: "suffix",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 253 },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "version",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
  ],
  invariants: [
  ],
});