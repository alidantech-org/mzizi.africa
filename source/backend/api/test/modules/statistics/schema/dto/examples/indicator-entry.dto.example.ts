import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { Aggregation } from "#/modules/statistics/schema/enum/aggregation.enum.ts";
import { Frequency } from "#/modules/statistics/schema/enum/frequency.enum.ts";
import { indicatorEntryNamesExample } from "@test/modules/statistics/schema/dto/examples/indicator-entry-names.dto.example.ts";

/** The contract shape of IndicatorEntry, for generated tests. */
export const indicatorEntryExample: ContractExample = contractExample({
  name: "IndicatorEntry",
  fields: [
    {
      name: "aggregation",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(Aggregation) },
    },
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
      name: "decimals",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0, max: 10 },
    },
    {
      name: "frequency",
      optional: false,
      nullable: true,
      spec: { kind: "enum", values: Object.values(Frequency) },
    },
    {
      name: "higherIsBetter",
      optional: false,
      nullable: true,
      spec: { kind: "boolean" },
    },
    {
      name: "indicatorId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "kindTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "names",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => indicatorEntryNamesExample },
    },
    {
      name: "roleTerm",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "topicTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "unitSymbol",
      optional: false,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
  ],
  invariants: [],
});
