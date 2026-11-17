import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import { featureEntryNamesExample } from "@test/modules/geography/schema/dto/examples/feature-entry-names.dto.example.ts";

/** The contract shape of FeatureEntry, for generated tests. */
export const featureEntryExample: ContractExample = contractExample({
  name: "FeatureEntry",
  fields: [
    {
      name: "code",
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
      name: "featureId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "featureTypeId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "fromToPrecision",
      optional: false,
      nullable: true,
      spec: { kind: "enum", values: Object.values(DatePrecision) },
    },
    {
      name: "fromYear",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: -10000, max: 3000 },
    },
    {
      name: "names",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => featureEntryNamesExample },
    },
    {
      name: "toYear",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: -10000, max: 3000 },
    },
  ],
  invariants: [],
});
