import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { FigureBasis } from "#/modules/shared/schema/enum/figure-basis.enum.ts";
import { FigureStatus } from "#/modules/shared/schema/enum/figure-status.enum.ts";
import { observationEntryBreakdownsExample } from "@test/modules/statistics/schema/dto/examples/observation-entry-breakdowns.dto.example.ts";

/** The contract shape of ObservationEntry, for generated tests. */
export const observationEntryExample: ContractExample = contractExample({
  name: "ObservationEntry",
  fields: [
    {
      name: "basis",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(FigureBasis) },
    },
    {
      name: "breakdowns",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => observationEntryBreakdownsExample,
      },
    },
    {
      name: "cell",
      optional: false,
      nullable: false,
      spec: { kind: "string", maxLength: 1000 },
    },
    {
      name: "collectionId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "fromYear",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: -10000, max: 3000 },
    },
    {
      name: "lower",
      optional: false,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "observationId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "revision",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1 },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(FigureStatus) },
    },
    {
      name: "supersedesId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "toYear",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: -10000, max: 3000 },
    },
    {
      name: "upper",
      optional: false,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "value",
      optional: false,
      nullable: true,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
