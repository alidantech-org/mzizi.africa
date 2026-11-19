import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeStatisticsBreakdownsAgeExample } from "@test/modules/insights/schema/dto/examples/place-statistics-breakdowns-age.dto.example.ts";
import { placeStatisticsBreakdownsCommunityExample } from "@test/modules/insights/schema/dto/examples/place-statistics-breakdowns-community.dto.example.ts";
import { placeStatisticsBreakdownsLanguageExample } from "@test/modules/insights/schema/dto/examples/place-statistics-breakdowns-language.dto.example.ts";
import { placeStatisticsBreakdownsResidenceExample } from "@test/modules/insights/schema/dto/examples/place-statistics-breakdowns-residence.dto.example.ts";
import { placeStatisticsBreakdownsSexExample } from "@test/modules/insights/schema/dto/examples/place-statistics-breakdowns-sex.dto.example.ts";

/** The contract shape of PlaceStatisticsBreakdowns, for generated tests. */
export const placeStatisticsBreakdownsExample: ContractExample = contractExample({
  name: "PlaceStatisticsBreakdowns",
  fields: [
    {
      name: "age",
      optional: true,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => placeStatisticsBreakdownsAgeExample,
      },
    },
    {
      name: "community",
      optional: true,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => placeStatisticsBreakdownsCommunityExample,
      },
    },
    {
      name: "language",
      optional: true,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => placeStatisticsBreakdownsLanguageExample,
      },
    },
    {
      name: "residence",
      optional: true,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => placeStatisticsBreakdownsResidenceExample,
      },
    },
    {
      name: "sex",
      optional: true,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => placeStatisticsBreakdownsSexExample,
      },
    },
  ],
  invariants: [],
});
