import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { facilityEntryExample } from "@test/modules/civic/schema/dto/examples/facility-entry.dto.example.ts";

/** The contract shape of FacilityCollection, for generated tests. */
export const facilityCollectionExample: ContractExample = contractExample({
  name: "FacilityCollection",
  fields: [
    {
      name: "facilities",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => facilityEntryExample },
    },
  ],
  invariants: [],
});
