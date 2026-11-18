import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeCrumbExample } from "@test/modules/insights/schema/dto/examples/place-crumb.dto.example.ts";

/** The contract shape of PlaceStatistics, for generated tests. */
export const placeStatisticsExample: ContractExample = contractExample({
  name: "PlaceStatistics",
  fields: [
    {
      name: "breakdowns",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
    {
      name: "chain",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => placeCrumbExample },
    },
    {
      name: "comparisons",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "place",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => placeCrumbExample },
    },
    {
      name: "siblings",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
    {
      name: "topics",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
  ],
  invariants: [],
});
