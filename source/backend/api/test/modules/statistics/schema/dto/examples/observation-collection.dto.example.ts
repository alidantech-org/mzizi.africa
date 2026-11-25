import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { observationEntryExample } from "@test/modules/statistics/schema/dto/examples/observation-entry.dto.example.ts";

/** The contract shape of ObservationCollection, for generated tests. */
export const observationCollectionExample: ContractExample = contractExample({
  name: "ObservationCollection",
  fields: [
    {
      name: "observations",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => observationEntryExample },
    },
  ],
  invariants: [],
});
