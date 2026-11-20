import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of CoordinatesInput, for generated tests. */
export const coordinatesInputExample: ContractExample = contractExample({
  name: "CoordinatesInput",
  fields: [
    {
      name: "accuracyMeters",
      optional: true,
      nullable: false,
      spec: { kind: "number", min: 0, max: 100000 },
    },
    {
      name: "countryCode",
      optional: true,
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
      name: "latitude",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: -90, max: 90 },
    },
    {
      name: "longitude",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: -180, max: 180 },
    },
  ],
  invariants: [],
});
