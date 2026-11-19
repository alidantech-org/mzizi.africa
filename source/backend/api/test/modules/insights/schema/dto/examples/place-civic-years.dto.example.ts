import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeCivicYearsClassesExample } from "@test/modules/insights/schema/dto/examples/place-civic-years-classes.dto.example.ts";

/** The contract shape of PlaceCivicYears, for generated tests. */
export const placeCivicYearsExample: ContractExample = contractExample({
  name: "PlaceCivicYears",
  fields: [
    {
      name: "classes",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => placeCivicYearsClassesExample },
    },
    {
      name: "total",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "year",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
