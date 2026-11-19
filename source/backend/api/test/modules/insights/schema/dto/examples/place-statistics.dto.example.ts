import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeCrumbExample } from "@test/modules/insights/schema/dto/examples/place-crumb.dto.example.ts";
import { placeStatisticsBreakdownsExample } from "@test/modules/insights/schema/dto/examples/place-statistics-breakdowns.dto.example.ts";
import { placeStatisticsComparisonsExample } from "@test/modules/insights/schema/dto/examples/place-statistics-comparisons.dto.example.ts";
import { placeStatisticsSiblingsExample } from "@test/modules/insights/schema/dto/examples/place-statistics-siblings.dto.example.ts";
import { placeStatisticsTopicsExample } from "@test/modules/insights/schema/dto/examples/place-statistics-topics.dto.example.ts";

/** The contract shape of PlaceStatistics, for generated tests. */
export const placeStatisticsExample: ContractExample = contractExample({
  name: "PlaceStatistics",
  fields: [
    {
      name: "breakdowns",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => placeStatisticsBreakdownsExample },
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
      spec: {
        kind: "schema",
        example: () => placeStatisticsComparisonsExample,
      },
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
      spec: { kind: "schema", example: () => placeStatisticsSiblingsExample },
    },
    {
      name: "topics",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => placeStatisticsTopicsExample },
    },
  ],
  invariants: [],
});
