import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PlaceCivicYearsClasses, for generated tests. */
export const placeCivicYearsClassesExample: ContractExample = contractExample({
  name: "PlaceCivicYearsClasses",
  fields: [
    {
      name: "amount",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "label",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "lines",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
