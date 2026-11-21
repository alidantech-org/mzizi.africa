import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PlaceStatisticsInput, for generated tests. */
export const placeStatisticsInputExample: ContractExample = contractExample({
  name: "PlaceStatisticsInput",
  fields: [
    {
      name: "countryCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", exactLength: 2, patterns: ["^[A-Z]{2}$"] },
    },
    {
      name: "languageCode",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 35 },
    },
    {
      name: "path",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 1500 },
    },
    {
      name: "scope",
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "topic",
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
