import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of IndicatorMapUnits, for generated tests. */
export const indicatorMapUnitsExample: ContractExample = contractExample({
  name: "IndicatorMapUnits",
  fields: [
    {
      name: "estimated",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "featureId",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "geometry",
      optional: true,
      nullable: true,
      spec: { kind: "unknown" },
    },
    {
      name: "kind",
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
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "rank",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "value",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
