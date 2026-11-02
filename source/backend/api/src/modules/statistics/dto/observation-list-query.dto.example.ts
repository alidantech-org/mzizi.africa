import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import { ConfidenceLevel } from "#/types/statistics/confidence-level.enum.ts";
import { baseQueryExample } from "#/modules/shared/dto/base-query.dto.example.ts";

/** The contract shape of ObservationListQuery, for generated tests. */
export const observationListQueryExample: ContractExample = contractExample({
  name: "ObservationListQuery",
  fields: [
    {
      name: "confidenceLevel",
      optional: true,
      nullable: false,
      spec: { kind: "enum", values: Object.values(ConfidenceLevel) },
    },
    {
      name: "geoUnitId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "includeHistory",
      optional: true,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "indicatorId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "limit",
      optional: true,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1000 },
    },
    {
      name: "order",
      optional: true,
      nullable: false,
      spec: { kind: "enum", values: Object.values(SortDirection) },
    },
    {
      name: "page",
      optional: true,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1000 },
    },
    {
      name: "periodId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "sort",
      optional: true,
      nullable: false,
      spec: { kind: "enum", values: Object.values(SortDirection) },
    },
    {
      name: "tableId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [
  ],
});