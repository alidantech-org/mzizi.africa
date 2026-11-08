import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { personExample } from "#/modules/person/dto/person.dto.example.ts";
import { historicalEntityExample } from "#/modules/shared/dto/historical-entity.dto.example.ts";

/** The contract shape of PersonProfile, for generated tests. */
export const personProfileExample: ContractExample = contractExample({
  name: "PersonProfile",
  fields: [
    {
      name: "biography",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1 },
    },
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
      name: "isCurrent",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "language",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "nationalityId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "occupation",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "personId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "summary",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 4000 },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "validFrom",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "validFromPrecision",
      optional: true,
      nullable: true,
      spec: { kind: "enum", values: Object.values(DatePrecision) },
    },
    {
      name: "validTo",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "validToPrecision",
      optional: true,
      nullable: true,
      spec: { kind: "enum", values: Object.values(DatePrecision) },
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