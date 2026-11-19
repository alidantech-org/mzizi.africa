import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PlaceStatisticsComparisonsPlace, for generated tests. */
export const placeStatisticsComparisonsPlaceExample: ContractExample = contractExample({
  name: "PlaceStatisticsComparisonsPlace",
  fields: [
    {
      name: "featureId",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "kindCode",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "kindLabel",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "path",
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
