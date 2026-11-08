import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";

/** The contract shape of IndicatorCategoryPublic, for generated tests. */
export const indicatorCategoryPublicExample: ContractExample = contractExample({
  name: "IndicatorCategoryPublic",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 200 },
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
      name: "label",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "parentId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
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